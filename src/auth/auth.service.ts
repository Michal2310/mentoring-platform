import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { MailerTemplate } from '../mail/mail.templates';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailer: MailService,
    private mailerTemplate: MailerTemplate,
  ) {}

  async register(dto: RegisterDto): Promise<Tokens> {
    try {
      const hashedPassword = await argon.hash(dto.password);
      const verificationToken = randomBytes(5).toString('hex');
      const { id, email, verifyToken } = await this.prisma.users.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          verifyToken: verificationToken,
        },
      });
      await this.mailer.sendMail(email, this.mailerTemplate.verification(verifyToken, email));
      const tokens = await this.getTokens(id, email);
      await this.updateRefreshToken(id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002') throw new ForbiddenException('Credentials taken');
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<Tokens> {
    try {
      const user = await this.getUser(dto.email);
      if (!user) throw new ForbiddenException('Access denied');
      const isPasswordMatch = await argon.verify(user.password, dto.password);
      if (!isPasswordMatch) throw new ForbiddenException('Access denied');
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      delete user.password, user.refreshToken;
      await this.cacheManager.set('user', user);
      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException)
        throw new ForbiddenException('Email or password is incorrect');
      throw error;
    }
  }

  async logout(userId: number) {
    try {
      this.cacheManager.reset();
      return await this.prisma.users.updateMany({
        where: {
          AND: [
            { id: userId },
            {
              refreshToken: {
                not: null,
              },
            },
          ],
        },
        data: {
          refreshToken: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async refresh(userId: number, rt: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user || user.refreshToken) throw new ForbiddenException('Acccess denied');
      const isRefreshTokenMatch = await argon.verify(user.refreshToken, rt);
      if (!isRefreshTokenMatch) throw new ForbiddenException('Acccess denied');
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async verificationToken(verificationToken: string, email: string) {
    try {
      const user = await this.getUser(email);
      if (!user) throw new NotFoundException();
      if (user.verifyToken == verificationToken) {
        Redirect(`http://localhost:${this.config.get('PORT')}/`, 200);
        return await this.prisma.users.update({
          where: {
            email,
          },
          data: {
            isVerified: true,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const secret = this.config.get('JWT_SECRET');
    const refresh = this.config.get('JWT_REFRESH');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync({ sub: userId, email }, { secret, expiresIn: 60 * 60 * 60 }),
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: refresh, expiresIn: 60 * 60 * 24 * 7 },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateRefreshToken(userId: number, rt: string): Promise<void> {
    const hashedRefreshToken = await argon.hash(rt);
    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  private async getUser(email: string) {
    return await this.prisma.users.findUnique({ where: { email } });
  }
}

import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { ForbiddenError } from '@casl/ability';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { Cache } from 'cache-manager';
import { Users } from '@prisma/client';
import { ChangePasswordDto } from './dto';
@Injectable()
export class AccountService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private prisma: PrismaService,
    private abilityFactory: AbilityFactory,
  ) {}

  async getUserAccount(userId: number): Promise<Users> {
    try {
      const cachedUser: Users = await this.cacheManager.get('user');
      if (cachedUser) return cachedUser;

      const user = await this.prisma.users.findUnique({
        where: { id: userId },
        include: {
          country: true,
          languages: {
            select: { language: true },
          },
          skills: {
            select: { skill: true },
          },
          image: {
            select: { fileUrl: true },
          },
        },
      });
      if (!user) throw new NotFoundException();
      delete user.password;
      delete user.verifyToken;
      delete user.refreshToken;
      await this.cacheManager.set('user', user);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async changeUserPassword(userId: number, dto: ChangePasswordDto): Promise<Users> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });

      const ability = this.abilityFactory.createForUser(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Manage, user);

      const isPasswordMatch = await argon.verify(user.password, dto.oldPassword);

      if (!isPasswordMatch) throw new ForbiddenException();

      const hashedPassword = await argon.hash(dto.newPassword);
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

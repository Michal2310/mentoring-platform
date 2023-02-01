import { ForbiddenError } from '@casl/ability';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AbilityFactory, Action } from '../ability/ability.factory';
import { MentorInfo, StatusType } from './types';
import { MailService } from '../mail/mail.service';
import { MailerTemplate } from '../mail/mail.templates';
import { PrismaService } from '../prisma/prisma.service';
import { MentorDto } from './dto';
import { Cache } from 'cache-manager';
import { Mentors, Users } from '@prisma/client';

@Injectable()
export class MentorService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private prisma: PrismaService,
    private abilityFactory: AbilityFactory,
    private mailer: MailService,
    private mailerTemplate: MailerTemplate,
  ) {}

  private getUserFields() {
    return {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      title: true,
      about: true,
      skills: true,
      languages: true,
      image: {
        select: { fileUrl: true },
      },
    };
  }

  private updateUser(prisma: PrismaService, userId: number, dto: MentorDto) {
    return prisma.users.update({
      where: { id: userId },
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        title: dto.title,
        about: dto.about,
        country: { connect: { country: dto.country } },
        languages: {
          connect: dto.languages.map((language) => {
            return { language };
          }),
        },
        skills: {
          connect: dto.skills.map((skill) => {
            return { skill };
          }),
        },
      },
      include: {
        country: true,
        languages: true,
        skills: true,
      },
    });
  }

  async getMentors(page: number): Promise<Mentors[]> {
    try {
      const skip: number = 20 * (page - 1);
      const mentors = await this.prisma.mentors.findMany({
        skip,
        take: 20,
        where: { status: 'Accepted' },
        include: {
          user: { select: this.getUserFields() },
        },
      });
      if (mentors.length < 1 || page < 1) throw new NotFoundException('');
      return mentors;
    } catch (error) {
      throw error;
    }
  }
  async getMentor(mentorId: number): Promise<Users | MentorInfo> {
    try {
      const cachedMentor: Users = await this.cacheManager.get('mentor');
      if (cachedMentor?.id === mentorId) return cachedMentor;
      const mentor = await this.prisma.users.findFirst({
        where: { AND: [{ id: mentorId }, { isMentor: true }] },
        select: this.getUserFields(),
      });
      if (!mentor) throw new NotFoundException('Mentor not found!');
      await this.prisma.mentors.update({
        where: { id: mentorId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      await this.cacheManager.set('mentor', mentor);
      return mentor;
    } catch (error) {
      throw error;
    }
  }
  async sendMentorRequest(userId: number, dto: MentorDto): Promise<{ message: string }> {
    try {
      const user = await this.prisma.users.findUnique({ where: { id: userId } });
      if (!user) return new NotFoundException();
      const existingMentor = await this.prisma.mentors.findFirst({ where: { userId } });
      if (existingMentor) return new ConflictException();
      const updatedUser = this.updateUser(this.prisma, userId, dto);
      const mentor = this.prisma.mentors.create({ data: { userId } });
      await this.prisma.$transaction([updatedUser, mentor]);
      return { message: 'Mentor request sent!' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2025') {
          throw new BadRequestException();
        }
      throw error;
    }
  }
  async verifyPendingMentorRequests(
    userId: number,
    mentorId: number,
    status: StatusType,
  ): Promise<{
    message: string;
  }> {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id: userId },
      });
      const ability = this.abilityFactory.createForUser(user);
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, user);
      const updatedUser = this.prisma.users.update({
        where: { id: mentorId },
        data: { isMentor: status === StatusType.Accepted ? true : false },
      });
      const mentor = this.prisma.mentors.update({
        where: { id: mentorId },
        data: { status: { set: status } },
      });
      await this.mailer.sendMail(user.email, this.mailerTemplate.mentorStatus());
      await this.prisma.$transaction([updatedUser, mentor]);
      return { message: 'User and mentor updated' };
    } catch (error) {
      if (error instanceof ForbiddenError) throw new UnauthorizedException();
      throw error;
    }
  }
}

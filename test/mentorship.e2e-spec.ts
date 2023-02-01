import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NotFoundInterceptor } from 'src/common/interceptors';
import { Reflector } from '@nestjs/core';
import { AtGuard } from '../src/common/guards';
import { getAccessToken } from './test-helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { MentorshipDto } from '../src/mentorship/dto';
import { StatusType } from '../src/mentorship/types';
import { MentorshipModule } from '../src/mentorship/mentorship.module';

describe('Mentor', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let email: string;
  let password: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MentorshipModule],
    }).compile();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new NotFoundInterceptor());
    const reflector = new Reflector();
    app.useGlobalGuards(new AtGuard(reflector));
    accessToken = await getAccessToken(app, 'e2e9@host.com', 'password');
    await app.init();
  });
  afterAll(async () => await app.close());

  describe('POST /mentorship/:mentorId', () => {
    it('Should create new mentorship request', async () => {
      const mentorId: number = 2;
      const body: MentorshipDto = {
        background: '',
        expectations: '',
        message: '',
      };

      const response = await request(app.getHttpServer())
        .post(`/mentorship/${mentorId}`)
        .send(body)
        .set('Authorization', accessToken);
      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /mentorship/myrequests', () => {
    it('Should return all user sended mentorships', async () => {
      const response = await request(app.getHttpServer())
        .get('/mentorship/myrequests')
        .set('Authorization', accessToken);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
    });
  });
  describe('GET /mentorship/receivedRequests', () => {
    it('Should return mentorships send to the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/mentorship/receivedRequests')
        .set('Authorization', accessToken);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
    });
  });
  describe('PATCH /mentorship/:id', () => {
    it('Should update mentoship request with passed status in query', async () => {
      const id: number = 2;
      const status: StatusType = StatusType.Accepted;
      const response = await request(app.getHttpServer())
        .patch(`/mentorship/${id}`)
        .query({ status })
        .set('Authorization', accessToken);
      expect(response.status).toEqual(200);
    }, 30000);
  });
});

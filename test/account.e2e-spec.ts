import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { NotFoundInterceptor } from 'src/common/interceptors';
import { Reflector } from '@nestjs/core';
import { AtGuard } from '../src/common/guards';
import { getAccessToken } from './test-helper';
import { PrismaService } from '../src/prisma/prisma.service';
import { AccountModule } from '../src/account/account.module';

describe('Account', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    const reflector = new Reflector();

    app.useGlobalInterceptors(new NotFoundInterceptor());
    app.useGlobalGuards(new AtGuard(reflector));
    await app.init();
  });
  afterAll(async () => await app.close());

  describe('GET /', () => {
    it('Should return user object', async () => {
      const loginCredentials = {
        email: '',
        password: '',
      };
      const accessToken = await getAccessToken(
        app,
        loginCredentials.email,
        loginCredentials.password,
      );
      const response = await request(app.getHttpServer())
        .get('/account')
        .set('Authorization', accessToken);

      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.email).toEqual(loginCredentials.email);
    });
  });

  describe('PATCH /', () => {
    it('Should return user object with updated password', async () => {
      const loginCredentials = {
        email: '',
        oldPassword: '',
        newPassword: '',
      };
      const accessToken: string = await getAccessToken(
        app,
        loginCredentials.email,
        loginCredentials.oldPassword,
      );
      const response = await request(app.getHttpServer())
        .patch('/account')
        .send({
          oldPassword: loginCredentials.oldPassword,
          newPassword: loginCredentials.newPassword,
        })
        .set('Authorization', accessToken);

      const { password } = await prisma.users.findUnique({
        where: { email: loginCredentials.email },
      });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.password).toEqual(password);
    });
  });
});

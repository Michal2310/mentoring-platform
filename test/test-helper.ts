import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
export async function getAccessToken(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    email,
    password,
  });
  return `Bearer ${response.body.access_token}`;
}

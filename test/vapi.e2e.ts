import request from 'supertest';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { VerificationModule } from '../src/verification/verification.module';

describe('Venn Verification API (e2e', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [VerificationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('can verify standard Ethereum transactions', () => {
    const server = app.getHttpServer();
    const path = '/v1/verify';

    return request(server).post(path).expect(201);
  });
});

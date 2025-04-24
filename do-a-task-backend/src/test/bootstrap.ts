import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../app.module';

let app: INestApplication;

export async function bootstrapE2E() {
  if (!app) {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    pactum.request.setBaseUrl('http://localhost:3005'); // your test server URL
  }
  return app;
}

export async function closeE2E() {
  if (app) {
    await app.close();
  }
}
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../app.module';

let app: INestApplication;

/**
 * Call this in your beforeAll() in every e2e spec.
 * It will:
 *   – create TestingModule
 *   – init the Nest app
 *   – tell Pactum where to send requests
 */
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

/**
 * Call this in your afterAll() if you want to tear down
 */
export async function closeE2E() {
  if (app) {
    await app.close();
  }
}
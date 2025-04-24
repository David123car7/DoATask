import { bootstrapE2E, closeE2E} from "../bootstrap";
import * as pactum from 'pactum';

describe('Auth module (e2e)', () => {
  beforeAll(async () => {
    await bootstrapE2E();
  });
  afterAll(() => closeE2E());

  it('Should sign in', async () => {
    await pactum
      .spec()
      .post('/auth/signin')
      .withJson({ email: 'david123car7@gmail.com', password: '123456' })
      .expectStatus(200);
  });

  it('Should not sign in (wrong credentials)', async () => {
    await pactum
      .spec()
      .post('/auth/signin')
      .withJson({ email: 'david123car7@gmail.com', password: 'wrongPassword' })
      .expectStatus(400);
  });
});
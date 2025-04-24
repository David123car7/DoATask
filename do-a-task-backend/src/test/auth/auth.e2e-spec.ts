import { bootstrapE2E, closeE2E} from "../bootstrap";
import * as pactum from 'pactum';

describe('Auth module (e2e)', () => {
  beforeAll(async () => {
    await bootstrapE2E();
  });
  afterAll(() => closeE2E());

  it('Should sign in', async () => {
    const message = await pactum
      .spec()
      .post('/auth/signin')
      .withJson({ email: 'david123car7@gmail.com', password: '123456' })
      .expectStatus(200)
      .returns("res.body.message")

    console.log('⬅️  Should sign in:', message);
  });

  it('Should not sign in (wrong credentials)', async () => {
    const message = await pactum
      .spec()
      .post('/auth/signin')
      .withJson({ email: 'david123car7@gmail.com', password: 'wrongPassword' })
      .expectStatus(400)
      .returns("res.body.message")

      console.log('⬅️  Should not sign in (wrong credentials):', message);
  });

  it('Should not sign in (empty body)', async () => {
    const message = await pactum
      .spec()
      .post('/auth/signin')
      .withJson({ email: '', password: '' })
      .expectStatus(400)
      .returns("res.body.message")

      console.log('⬅️  Should not sign in (empty body):', message);
  });

  it('Should not sign up (email allready registred)', async () => {
    const message = await pactum
      .spec()
      .post('/auth/signup')
      .withJson({ email: 'david123car7@gmail.com', password: '123456', name: "name", birthDate:"2025-03-18T19:29:22.247Z", contactNumber: "111222333"})
      .expectStatus(422)
      .returns("res.body.message")

    console.log('⬅️  Should not sign up (email allready registred):', message);
  });
});
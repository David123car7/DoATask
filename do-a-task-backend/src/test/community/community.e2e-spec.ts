import { bootstrapE2E, closeE2E } from '../bootstrap';
import * as pactum from 'pactum';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

// Test data constants
const userDTO = {
  id: 'userID',
  name: 'userName',
  email: 'test@gmail.com',
  password: '123456',
};
const contactDTO = {
  number: '111222333',
};
const localityDTO = {
  name: 'TestLoc',
  maxPostalNumber: '55',
  minPostalNumber: '11',
};
const communityDTO = {
  communityName: 'TestCommunity',
  location: localityDTO.name,
};

describe('Community API Integration with Pactum (E2E)', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let access_token: string;

  beforeAll(async () => {
    const app = await bootstrapE2E();
    supabase = app.get<SupabaseService>(SupabaseService);
    await supabase.cleanAuthUsers();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();

    const contact = await prisma.contact.create({ data: { number: contactDTO.number } });
    await prisma.user.create({ data: {
      id: userDTO.id,
      name: userDTO.name,
      email: userDTO.email,
      birthDate: new Date(),
      contactId: contact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    await prisma.locality.create({ data: localityDTO });

    const { data, error } = await supabase.getPublicClient().auth.signUp({ email: userDTO.email, password: userDTO.password });
    access_token = data.session.access_token;
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('POST /community/createCommunity', () => {
    it('should create a community', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(communityDTO)
        .expectStatus(201)
    });

    it('should return 400 if user already has a community', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(communityDTO)
        .expectStatus(400);
    });

    it('should return 400 if community name exists', async () => {
      // new user with no community
      const newUser = await prisma.user.create({ data: {
        id: 'user2', name: 'User2', email: 'test2@gmail.com', birthDate: new Date(), contactId: (await prisma.contact.create({ data: { number: '222333444' }})).id, createdAt: new Date(), updatedAt: new Date()
      }});
      // get fresh token
      const { data, error } = await supabase.getPublicClient().auth.signUp({ email: 'test2@gmail.com', password: '123456' });
      const token2 = data.session.access_token;

      // first creation succeeds
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${token2}`)
        .withJson(communityDTO)
        .expectStatus(201);

      // second creation with same name fails
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${token2}`)
        .withJson(communityDTO)
        .expectStatus(400);
    });

    it('should return 400 if location does not exist', async () => {
      const badCommunity = { communityName: 'NewComm', location: 'NoWhere' };
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(badCommunity)
        .expectStatus(400);
    });

    it('should return 401 if unauthorized', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withJson(communityDTO)
        .expectStatus(401);
    });
  });
});

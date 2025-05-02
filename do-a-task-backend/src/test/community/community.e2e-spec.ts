import { bootstrapE2E, closeE2E } from '../bootstrap';
import * as pactum from 'pactum';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

const userDTO = {
  id: 'userID',
  name: 'userName',
  email: 'test@gmail.com',
  password: '123456',
};

const user2DTO = {
  id: 'user2ID',
  name: 'user2Name',
  email: 'test2@gmail.com',
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
  let access_tokenUser1: string;
  let access_tokenUser2: string;


  beforeAll(async () => {
    const app = await bootstrapE2E();
    supabase = app.get<SupabaseService>(SupabaseService);
    await supabase.cleanAuthUsers();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();

    
    const user1Response = await supabase.getPublicClient().auth.signUp({ email: userDTO.email, password: userDTO.password });
    const user2Response = await supabase.getPublicClient().auth.signUp({ email: user2DTO.email, password: user2DTO.password });
    access_tokenUser1 = user1Response.data.session.access_token;
    access_tokenUser2 = user2Response.data.session.access_token;

    const contact = await prisma.contact.create({ data: { number: contactDTO.number } });
    const contact2 = await prisma.contact.create({ data: { number: contactDTO.number } });

    await prisma.user.create({ data: {
      id: user1Response.data.user.id,
      name: userDTO.name,
      email: userDTO.email,
      birthDate: new Date(),
      contactId: contact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    await prisma.user.create({ data: {
      id: user2Response.data.user.id,
      name: user2DTO.name,
      email: user2DTO.email,
      birthDate: new Date(),
      contactId: contact2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});
    await prisma.locality.create({ data: localityDTO });
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('POST /community/createCommunity', () => {
    it('should create a community', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser1}`)
        .withJson(communityDTO)
        .expectStatus(201)
    });

    it('should not create a community if user already has a community', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser1}`)
        .withJson(communityDTO)
        .expectStatus(400);
    });

    it('should not create community if community name exists', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson(communityDTO)
        .expectStatus(400);
    });

    it('should not create a community if location does not exist', async () => {
      const badCommunity = { communityName: 'NewComm', location: 'NoWhere' };
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser1}`)
        .withJson(badCommunity)
        .expectStatus(400);
    });

    it('should not create a community if user is unauthorized', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withJson(communityDTO)
        .expectStatus(401);
    });
  });
  
  describe('POST /community/enterCommunity', () => {
    it('should allow user2 to enter the existing community', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(201)
        .expectBodyContains('User entered community');
    });

    it('should not allow entering again', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(400)
        .expectBodyContains('The user allready is in the community');
    });

    it('should not allow entering non-existent community', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: 'NoCommunity' })
        .expectStatus(400)
        .expectBodyContains('Community with this name does not exist');
    });

    it('should require authentication', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(401);
    });
  });

  describe('DELETE /community/exitCommunity', () => {
    it('should allow user2 to exit the community', async () => {
      await pactum.spec()
        .delete('/community/exitCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(200)
    });

    it('should allow user2 to exit the community', async () => {
      await pactum.spec()
        .delete('/community/exitCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(400)
    });

    it('should require authentication', async () => {
      await pactum.spec()
        .delete('/community/exitCommunity')
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(401);
    });

  });
});

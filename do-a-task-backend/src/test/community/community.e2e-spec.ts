import { bootstrapE2E, closeE2E } from '../bootstrap';
import * as pactum from 'pactum';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';

//Creates the community 
const userDTO = {
  id: 'userID',
  name: 'userName',
  email: 'test@gmail.com',
  password: '123456',
};

//Enters the community
const user2DTO = {
  id: 'user2ID',
  name: 'user2Name',
  email: 'test2@gmail.com',
  password: '123456',
};

//Cant Enter the community
const user3DTO = {
  id: 'user3ID',
  name: 'user3Name',
  email: 'test3@gmail.com',
  password: '123456',
};

const contactDTO = {
  number: '111222333',
};
const localityDTO = {
  name: 'TestLoc',
  maxPostalNumber: '4000-999',
  minPostalNumber: '4000-000',
};

const addressDTO = {
  port: 259,
  street: 'TestStreet',
  postalCode: '4000-100',
}

const invalidAddressDTO = {
  port: 259,
  street: 'TestStreet',
  postalCode: '1000-100',
}
const communityDTO = {
  communityName: 'TestCommunity',
  location: localityDTO.name,
};

describe('Community API Integration with Pactum (E2E)', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let access_tokenUser1: string;
  let access_tokenUser2: string;
  let access_tokenUser3: string;

  beforeAll(async () => {
    const app = await bootstrapE2E();
    supabase = app.get<SupabaseService>(SupabaseService);
    await supabase.cleanAuthUsers();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();

    const user1Response = await supabase.getPublicClient().auth.signUp({ email: userDTO.email, password: userDTO.password });
    const user2Response = await supabase.getPublicClient().auth.signUp({ email: user2DTO.email, password: user2DTO.password });
    const user3Response = await supabase.getPublicClient().auth.signUp({ email: user3DTO.email, password: user3DTO.password });

    access_tokenUser1 = user1Response.data.session.access_token;
    access_tokenUser2 = user2Response.data.session.access_token;
    access_tokenUser3 = user3Response.data.session.access_token;

    const contact = await prisma.contact.create({ data: { number: contactDTO.number } });
    const contact2 = await prisma.contact.create({ data: { number: contactDTO.number } });
    const contact3 = await prisma.contact.create({ data: { number: contactDTO.number } });

    const creator = await prisma.user.create({ data: {
      id: user1Response.data.user.id,
      name: userDTO.name,
      email: userDTO.email,
      birthDate: new Date(),
      contactId: contact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    const enterUser = await prisma.user.create({ data: {
      id: user2Response.data.user.id,
      name: user2DTO.name,
      email: user2DTO.email,
      birthDate: new Date(),
      contactId: contact2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    const enterUser2 = await prisma.user.create({ data: {
      id: user3Response.data.user.id,
      name: user3DTO.name,
      email: user3DTO.email,
      birthDate: new Date(),
      contactId: contact3.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});
    
    await prisma.locality.create({ data: localityDTO });
    await prisma.address.create({ data: { port: addressDTO.port, postalCode: addressDTO.postalCode, street: addressDTO.street, userId: creator.id} });
    await prisma.address.create({ data: { port: addressDTO.port, postalCode: addressDTO.postalCode, street: addressDTO.street, userId: enterUser.id} });
    await prisma.address.create({ data: { port: invalidAddressDTO.port, postalCode: invalidAddressDTO.postalCode, street: invalidAddressDTO.street, userId: enterUser2.id} });
  }, 20000);

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

    it('should not create a community if user does not have a valid address', async () => {
      await pactum.spec()
        .post('/community/createCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser3}`)
        .withJson(communityDTO)
        .expectStatus(400)
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
    const dto = (name: string) => ({ communityName: name });

    it('should allow user to enter community', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson(dto(communityDTO.communityName))
        .expectStatus(201)
    });

    it('should not allow user to enter community id he does not have a valid address', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser3}`)
        .withJson(dto(communityDTO.communityName))
        .expectStatus(400);
    });

    it('should return 400 if community does not exist', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson(dto('NoSuch'))
        .expectStatus(400);
    });

    it('should return 401 if unauthorized', async () => {
      await pactum.spec()
        .post('/community/enterCommunity')
        .withJson(dto(communityDTO.communityName))
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
        .expectBodyContains('Exit community successful');
    });

    it('should not allow exiting if not a member', async () => {
      await pactum.spec()
        .delete('/community/exitCommunity')
        .withHeaders('Authorization', `Bearer ${access_tokenUser2}`)
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(400);
    });

    it('should require authentication', async () => {
      await pactum.spec()
        .delete('/community/exitCommunity')
        .withJson({ communityName: communityDTO.communityName })
        .expectStatus(401);
    });
  });
});

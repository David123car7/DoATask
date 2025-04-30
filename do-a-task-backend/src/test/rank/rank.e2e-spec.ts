import { bootstrapE2E, closeE2E } from '../bootstrap';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import * as pactum from 'pactum';

const userDTO = {
  name: 'UserName',
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
};

const itemDTO = { name: 'ItemA', price: "10", stock: "5" };

describe('Rank API Integration with Pactum (E2E)', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let access_token: string;

  beforeAll(async () => {
    const app = await bootstrapE2E();
    supabase = app.get<SupabaseService>(SupabaseService);
    await supabase.cleanAuthUsers();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await closeE2E();
  });

  describe('GET /rank/getRankByCommunity', () => {
    beforeAll(async () => {
      const { data, error } = await supabase.getPublicClient().auth.signUp({ email: userDTO.email, password: userDTO.password });
      access_token = data.session.access_token;

      const contact = await prisma.contact.create({data: { number: contactDTO.number }});

      await prisma.user.create({ data: {
        id: data.user.id,
        name: userDTO.name,
        email: userDTO.email,
        birthDate: new Date(),
        contactId: contact.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }});

      const loc = await prisma.locality.create({ data: {
        name: localityDTO.name,
        maxPostalNumber: localityDTO.maxPostalNumber,
        minPostalNumber: localityDTO.minPostalNumber,
      }});

      const community = await prisma.community.create({ data: {
        communityName: communityDTO.communityName,
        localityId: loc.id,
        creatorId: data.user.id,
      }});
      
      await prisma.member.create({ data: {userId: data.user.id,communityId: community.id,coins: 0,}});
    });

    it('should return rank ordered by points', async () => {
      await pactum.spec()
        .get('/rank/getRankByCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', communityDTO.communityName)
        .expectStatus(200)
    });

    it('should not return rank ordered by points if communityName missing', async () => {
      await pactum.spec()
        .get('/rank/getRankByCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .expectStatus(400);
    });

    it('should not return rank ordered by points if community does not exist', async () => {
      await pactum.spec()
        .get('/rank/getRankByCommunity')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', 'NonExistent')
        .expectStatus(400);
    });

    it('should not return rank ordered by points if user is unauthorized', async () => {
      await pactum.spec()
        .get('/rank/getRankByCommunity')
        .withQueryParams('communityName', communityDTO.communityName)
        .expectStatus(401);
    });
  });
});
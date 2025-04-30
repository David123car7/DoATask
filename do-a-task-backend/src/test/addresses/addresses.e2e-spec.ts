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
  maxPostalNumber: '1000-200',
  minPostalNumber: '1000-100',
};

const addressDTO = { port: 123, street: 'Street', locality: localityDTO.name, postalCode: '1000-150' };

describe('Addresses API Integration with Pactum (E2E)', () => {
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

  describe('POST /addresses/createAdressses', () => {
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
    });

    it('should create an address', async () => {
      await pactum.spec()
        .post('/addresses/createAdressses')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(addressDTO)
        .expectStatus(201)
    });

    it('should not create address if address already exists', async () => {
      await pactum.spec()
        .post('/addresses/createAdressses')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(addressDTO)
        .expectStatus(400);
    });

    it('should not create address if locality does not exist', async () => {
      const badAddress = { ...addressDTO, locality: 'NoWhere' };
      await pactum.spec()
        .post('/addresses/createAdressses')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withJson(badAddress)
        .expectStatus(400);
    });

    it('should not create address if unauthorized', async () => {
      await pactum.spec()
        .post('/addresses/createAdressses')
        .withJson(addressDTO)
        .expectStatus(401);
    });
  });
});
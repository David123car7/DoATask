import { bootstrapE2E, closeE2E } from '../bootstrap';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import * as pactum from 'pactum';
import { join } from 'path';

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

describe('Store API Integration with Pactum (E2E)', () => {
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

  describe('POST /store/createItem', () => {
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

      const com = await prisma.community.create({ data: {
        communityName: communityDTO.communityName,
        localityId: loc.id,
        creatorId: data.user.id,
      }});

      const store = await prisma.store.create({data:{communityId: com.id}})

      await prisma.member.create({ data: {
        userId: data.user.id,
        communityId: com.id,
        coins: 0,
      }});
    });

    it('should create an item with image upload', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/store/createItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withFile('image', imagePath)
        .withMultiPartFormData('name', itemDTO.name)
        .withMultiPartFormData('price', itemDTO.price)
        .withMultiPartFormData('stock', itemDTO.stock)
        .expectStatus(201)
        .expectJson({ message: 'Item was created' });
    });

    it('should not create the item if item allready exists', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/store/createItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withFile('image', imagePath)
        .withMultiPartFormData('name', itemDTO.name)
        .withMultiPartFormData('price', itemDTO.price)
        .withMultiPartFormData('stock', itemDTO.stock)
        .expectStatus(400);
    });

    it('should not create item if unauthorized', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/store/createItem')
        .withFile('image', imagePath)
        .withMultiPartFormData('name', itemDTO.name)
        .withMultiPartFormData('price', itemDTO.price)
        .withMultiPartFormData('stock', itemDTO.stock)
        .expectStatus(401);
    });
  });
});
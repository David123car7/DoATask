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

const itemDTO = { name: 'ItemA', price: 1, stock: 1 };

describe('Store API Integration with Pactum (E2E)', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let access_token: string;
  let item

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
        coins: 1,
      }});

      const img = await prisma.image.create({data:{imagePath: 'testPath'}})
      item = await prisma.item.create({data:{
        name: itemDTO.name,
        price: itemDTO.price,
        stock: itemDTO.stock,
        storeId: store.id,
        imageId: img.id,
        available: true,
      }});
    });

    it('should create an item with image upload', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/store/createItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withFile('image', imagePath)
        .withMultiPartFormData('name', "NewItem")
        .withMultiPartFormData('price', itemDTO.price.toString())
        .withMultiPartFormData('stock', itemDTO.stock.toString())
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
        .withMultiPartFormData('price', itemDTO.price.toString())
        .withMultiPartFormData('stock', itemDTO.stock.toString())
        .expectStatus(400);
    });

    it('should not create item if unauthorized', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/store/createItem')
        .withFile('image', imagePath)
        .withMultiPartFormData('name', itemDTO.name)
        .withMultiPartFormData('price', itemDTO.price.toString())
        .withMultiPartFormData('stock', itemDTO.stock.toString())
        .expectStatus(401);
    });
  });

  describe('PUT /store/buyItem', () => {
    it('should buy an item successfully', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', communityDTO.communityName)
        .withQueryParams('itemId', item.id)
        .expectStatus(200)
    });


    it('should return 400 if community does not exist', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', 'NoSuch')
        .withQueryParams('itemId', item.id)
        .expectStatus(400);
    });

    it('should return 400 if item does not exist', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', communityDTO.communityName)
        .withQueryParams('itemId', item.id)
        .expectStatus(400);
    });

    it('should return 400 if out of stock', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', communityDTO.communityName)
        .withQueryParams('itemId', item.id)
        .expectStatus(400);
    });

    it('should return 400 if insufficient coins', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('communityName', communityDTO.communityName)
        .withQueryParams('itemId', item.id)
        .expectStatus(400);
    });

    it('should return 401 if unauthorized', async () => {
      await pactum.spec()
        .put('/store/buyItem')
        .withQueryParams('communityName', communityDTO.communityName)
        .withQueryParams('itemId', item.id)
        .expectStatus(401);
    });
  });

  describe('PUT /store/showItem', () => {
    it('should show the item', async () => {
      await pactum.spec()
        .put('/store/showItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('itemId', item.id)
        .expectStatus(200)
    });

    it('should return 400 if item does not exist', async () => {
      await pactum.spec()
        .put('/store/showItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('itemId', 999999)
        .expectStatus(400);
    });

    it('should return 400 if missing itemId', async () => {
      await pactum.spec()
        .put('/store/showItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .expectStatus(400);
    });

    it('should return 401 if unauthorized', async () => {
      await pactum.spec()
        .put('/store/showItem')
        .withQueryParams('itemId', item.id)
        .expectStatus(401);
    });
  });

  describe('PUT /store/hideItem', () => {
    it('should hide the visible item', async () => {
      await pactum.spec()
        .put('/store/hideItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('itemId', item.id)
        .expectStatus(200)
    });

    it('should return 400 if item does not exist', async () => {
      await pactum.spec()
        .put('/store/hideItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withQueryParams('itemId', 999999)
        .expectStatus(400);
    });

    it('should return 400 if missing itemId', async () => {
      await pactum.spec()
        .put('/store/hideItem')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .expectStatus(400);
    });

    it('should return 401 if unauthorized', async () => {
      await pactum.spec()
        .put('/store/hideItem')
        .withQueryParams('itemId', item.id)
        .expectStatus(401);
    });
  });
});
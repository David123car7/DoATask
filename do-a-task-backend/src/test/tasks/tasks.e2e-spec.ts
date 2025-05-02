import { bootstrapE2E, closeE2E } from '../bootstrap';
import * as pactum from 'pactum';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { join } from 'path';

// Test data constants
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

describe('Tasks API Integration with Pactum (E2E)', () => {
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

  describe('POST /tasks/createTask', () => {
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

      const loc = await prisma.locality.create({ 
      data: {
        name: localityDTO.name,
        maxPostalNumber: localityDTO.maxPostalNumber,
        minPostalNumber: localityDTO.minPostalNumber,
      }});

      const com = await prisma.community.create({ data: {
        communityName: communityDTO.communityName,
        localityId: loc.id,
        creatorId: data.user.id,
      }});

      await prisma.member.create({ data: {
        userId: data.user.id,
        communityId: com.id,
        coins: 0,
      }});
    });

    it('should create a task with image upload', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withFile('image', imagePath)
        .withMultiPartFormData('tittle', 'Pactum Task')
        .withMultiPartFormData('description', 'Integration test')
        .withMultiPartFormData('difficulty', '3')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(201);
    });

    it('should not create task if community does not exist', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withFile('file', imagePath)
        .withMultiPartFormData('tittle', 'Another Task')
        .withMultiPartFormData('description', 'Integration test')
        .withMultiPartFormData('difficulty', '3')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', 'NonExistent')
        .expectStatus(400);
    });

    it('should not create task if file missing', async () => {
      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token}`)
        .withMultiPartFormData('tittle', 'No File Task')
        .withMultiPartFormData('description', 'No file provided')
        .withMultiPartFormData('difficulty', '2')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(400);
    });

    it('should not create task if user unauthorized', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withFile('file', imagePath)
        .withMultiPartFormData('tittle', 'Task')
        .withMultiPartFormData('description', 'Integration unauthorized')
        .withMultiPartFormData('difficulty', '1')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(401);
    });
  });
});
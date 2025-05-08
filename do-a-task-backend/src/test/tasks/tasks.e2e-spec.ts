import { bootstrapE2E, closeE2E } from '../bootstrap';
import * as pactum from 'pactum';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { join } from 'path';
import { TASK_STATES } from '../../lib/constants/tasks/tasks.constants';

const creatorUserDTO = {
  name: 'UserName',
  email: 'test@gmail.com',
  password: '123456',
};

const volunteerDTO = {
  name: 'UserName',
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
};

const imagePath = join(__dirname, '../images/testImage.png');

describe('Tasks API Integration with Pactum (E2E)', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let creatorMemberId: number
  let volunterMemberId: number
  let access_token_creator: string;
  let access_token_volunteer: string;
  let communityName: string

  beforeAll(async () => {
    const app = await bootstrapE2E();
    supabase = app.get<SupabaseService>(SupabaseService);
    await supabase.cleanAuthUsers();
    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();

    //Creating tables
    const loc = await prisma.locality.create({ data: {
      name: localityDTO.name,
      maxPostalNumber: localityDTO.maxPostalNumber,
      minPostalNumber: localityDTO.minPostalNumber,
    }});

    const { data: creatorUserData, error: creatorUserError } = await supabase.getPublicClient().auth.signUp({ email: creatorUserDTO.email, password: creatorUserDTO.password });
    access_token_creator = creatorUserData.session.access_token;

    const contact = await prisma.contact.create({data: { number: contactDTO.number }});

    await prisma.user.create({ data: {
      id: creatorUserData.user.id,
      name: creatorUserDTO.name,
      email: creatorUserDTO.email,
      birthDate: new Date(),
      contactId: contact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    const com = await prisma.community.create({ data: {
      communityName: communityDTO.communityName,
      localityId: loc.id,
      creatorId: creatorUserData.user.id,
    }});
    communityName = com.communityName

    const member = await prisma.member.create({ data: {
      userId: creatorUserData.user.id,
      communityId: com.id,
      coins: 0,
    }});
    creatorMemberId = member.id

    //Vollunter user creation
    const { data: volunteerUser, error: volunteerUserError } = await supabase.getPublicClient().auth.signUp({ email: volunteerDTO.email, password: volunteerDTO.password });
    access_token_volunteer = volunteerUser.session.access_token;

    await prisma.user.create({ data: {
      id: volunteerUser.user.id,
      name: volunteerDTO.name,
      email: volunteerDTO.email,
      birthDate: new Date(),
      contactId: contact.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }});

    const mem = await prisma.member.create({ data: {
      userId: volunteerUser.user.id,
      communityId: com.id,
      coins: 0,
    }});

    await prisma.pointsMember.create({
      data:{
        memberId: mem.id
      }
    })
    volunterMemberId = mem.id
  }, 20000);

  afterAll(async () => {
    await closeE2E();
  });

  describe('POST /tasks/createTask', () => {
    it('should create a task with image upload', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withFile('image', imagePath)
        .withMultiPartFormData('tittle', 'Pactum Task')
        .withMultiPartFormData('description', 'Integration test')
        .withMultiPartFormData('difficulty', '3')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(201);
    });

    it('should not create task if community does not exist', async () => {
      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
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
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
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

    it('should not create task if community does not exist', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withFile('image', imagePath)
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
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withMultiPartFormData('tittle', 'No File Task')
        .withMultiPartFormData('description', 'No file provided')
        .withMultiPartFormData('difficulty', '2')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(400)
        .expectBodyContains('The file does not exist');
    });

    it('should not create task if user unauthorized', async () => {
      const imagePath = join(__dirname, '../images/testImage.png');

      await pactum.spec()
        .post('/tasks/createTask')
        .withFile('image', imagePath)
        .withMultiPartFormData('tittle', 'Task')
        .withMultiPartFormData('description', 'Integration unauthorized')
        .withMultiPartFormData('difficulty', '1')
        .withMultiPartFormData('location', localityDTO.name)
        .withMultiPartFormData('communityName', communityDTO.communityName)
        .expectStatus(401);
    });
  });


  describe('GET /tasks/getTasksMemberDoing', () => {
    it('should return tasks the member is doing', async () => {
      await pactum.spec()
        .get('/tasks/getTasksMemberDoing')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .expectStatus(200)
        .expectJsonLike({ message: 'Task Found' })
        .expectJsonMatch({
          tasks: [], // você pode deixar vazio se espera isso no início
          memberTasks: [],
          community: [
            { communityName: communityDTO.communityName }
          ]
        });
    });

    it('should require authentication', async () => {
      await pactum.spec()
        .get('/tasks/getTasksMemberDoing')
        .expectStatus(401);
    });
  });

  describe('GET /tasks/getTasksByCommunity', () => {
    it('should return tasks by community', async () => {
      await pactum.spec()
        .get('/tasks/getTasksByCommunity')
        .withQueryParams('communityName', communityDTO.communityName)
        .expectStatus(200)
        .expectJsonLike({ message: 'Task Found' });
    });

    it('should fail without communityName', async () => {
      await pactum.spec()
        .get('/tasks/getTasksByCommunity')
        .expectStatus(400)
        .expectBodyContains('Community name is required');
    });
  });

  let task
  let memberTask
  describe('PUT /tasks/assignTask', () => {
    beforeAll(async () => {
      const image = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image.id,
        }
      });
      const mT = await prisma.memberTask.create({
        data:{
          status: "status",
          taskId: t.id,
        }
      })
      task = t
      memberTask = mT
    });

    it('should assign the task to the member', async () => {
      await pactum.spec()
        .put('/tasks/assignTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task.id)
        .expectStatus(200)
    });

    it('should not assign the task that is allready accepted', async () => {
      await pactum.spec()
        .put('/tasks/assignTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task.id)
        .expectStatus(400)
    });

    it('should not assign the task to the member who created the task', async () => {
      await pactum.spec()
        .put('/tasks/assignTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withQueryParams('taskId', task.id)
        .expectStatus(400)
    });

    it('should not assign the task that does not exist', async () => {
      await pactum.spec()
        .put('/tasks/assignTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', 9999)
        .expectStatus(400)
    });

    it('should not assign the user if is not authenticated', async () => {
      await pactum.spec()
        .put('/tasks/assignTask')
        .withQueryParams('taskId', task.id)
        .expectStatus(401)
    });
  });

  describe('PUT /tasks/finishTask', () => {
    it('should finish the task', async () => {
      await pactum.spec()
        .put('/tasks/finishTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('memberTaskId', memberTask.id)
        .expectStatus(200)
    });

    it('should not finish the task if the task is allready finished', async () => {
      await pactum.spec()
        .put('/tasks/finishTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('memberTaskId', memberTask.id)
        .expectStatus(400)
    });

    it('should not finish the task if the task does not exist', async () => {
      await pactum.spec()
        .put('/tasks/finishTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('memberTaskId', 999)
        .expectStatus(400)
    });

    it('should finish the task if is not authenticated', async () => {
      await pactum.spec()
        .put('/tasks/finishTask')
        .withQueryParams('memberTaskId', memberTask.id)
        .expectStatus(401)
    });
  })

  let task2
  describe('DELETE /tasks/deleteTask', () => {
    beforeAll(async () => {
      //Created task not accepted
      const image = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image.id,
        }
      });
      const mT = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.NOT_ACCEPTED,
          taskId: t.id,
        }
      })

      //Created task accepted
      const image2 = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t2 = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image2.id,
        }
      });
      const mT2 = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.ACCEPTED,
          taskId: t2.id,
        }
      })
      task = t
      memberTask = mT
      task2 = t2
    });
    it('should delete the task', async () => {
      await pactum.spec()
        .delete('/tasks/deleteTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task.id)
        .expectStatus(200)
    });

    it('should not delete the task if the task is allready accepted', async () => {
      await pactum.spec()
        .delete('/tasks/deleteTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task2.id)
        .expectStatus(400)
    });

    it('should not delete the task if the task does not exist', async () => {
      await pactum.spec()
        .delete('/tasks/deleteTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', 9999)
        .expectStatus(400)
    });

    it('should not delete the task if user is not authenticated', async () => {
      await pactum.spec()
        .delete('/tasks/deleteTask')
        .withQueryParams('taskId', 9999)
        .expectStatus(401)
    });
  });

  describe('Put /tasks/cancelTask', () => {
    beforeAll(async () => {
      //Created task not accepted
      const image = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image.id,
        }
      });
      const mT = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.NOT_ACCEPTED,
          taskId: t.id,
        }
      })

      const image2 = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t2 = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image2.id,
        }
      });
      const mT2 = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.ACCEPTED,
          taskId: t2.id,
        }
      })
      task2 = t2
      task = t
    });

    it('should cancel the task', async () => {
      await pactum.spec()
        .put('/tasks/cancelTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task2.id)
        .expectStatus(200)
    });

    it('should not cancel the task that is not accepted', async () => {
      await pactum.spec()
        .put('/tasks/cancelTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', task.id)
        .expectStatus(400)
    });

    it('should not cancel the task that does not exist', async () => {
      await pactum.spec()
        .put('/tasks/cancelTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withQueryParams('taskId', 9999)
        .expectStatus(400)
    });

    it('should not cancel the task if user is not authenticated', async () => {
      await pactum.spec()
        .put('/tasks/cancelTask')
        .withQueryParams('taskId', task.id)
        .expectStatus(401)
    });
  });

  let memberTask2
  let memberTask3
  describe('Put /tasks/evaluateTask', () => {
    beforeAll(async () => {
      //Created task not accepted
      const image = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image.id,
        }
      });
      const mT = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.FINISH,
          completedAt: new Date(),
          assignedAt: new Date(),
          taskId: t.id,
          volunteerId: volunterMemberId
        }
      })

      const image2 = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t2 = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image2.id,
        }
      });
      const mT2 = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.ACCEPTED,
          taskId: t2.id,
          volunteerId: volunterMemberId
        }
      })

      const image3 = await prisma.image.create({
        data: {
          imagePath: imagePath
        }
      });
      const t3 = await prisma.task.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          difficulty: 3,
          location: localityDTO.name,
          creatorId: creatorMemberId,
          imageId: image3.id,
        }
      });
      const mT3 = await prisma.memberTask.create({
        data:{
          status: TASK_STATES.EVALUATED,
          taskId: t3.id,
          volunteerId: volunterMemberId
        }
      })
      task2 = t2
      task = t
      memberTask = mT
      memberTask2 = mT2
      memberTask3 = mT3
    });

    it('should evaluate the task', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withJson({memberTaskId: memberTask.id, score: 5})
        .expectStatus(200)
    });

    it('should not evaluate a task that does not exist', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withJson({memberTaskId: 9999, score: 5})
        .expectStatus(400)
    });

    it('should not evaluate a task with a invalid score', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withJson({memberTaskId: memberTask.id, score: 10})
        .expectStatus(400)
    });

    it('should not evaluate a task if the user is not the task creator', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_volunteer}`)
        .withJson({memberTaskId: memberTask.id, score: 5})
        .expectStatus(400)
    });

    it('should not evaluate a task if the task is not yet finished', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withJson({memberTaskId: memberTask2.id, score: 5})
        .expectStatus(400)
    });

    it('should not evaluate a task if the task was allready evaluated', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withHeaders('Authorization', `Bearer ${access_token_creator}`)
        .withJson({memberTaskId: memberTask3.id, score: 5})
        .expectStatus(400)
    });

    it('should not evaluate a task if user is not authenticated', async () => {
      await pactum.spec()
        .put('/tasks/evaluateTask')
        .withJson({memberTaskId: memberTask.id, score: 5})
        .expectStatus(400)
    });
  });
});
  

  
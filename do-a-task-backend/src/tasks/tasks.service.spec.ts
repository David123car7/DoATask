import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('AuthControllerTest', () => {
  let tasksService: TasksService;

  const mockUserService = {
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TasksService],
    }).overrideProvider(TasksService).useValue(mockUserService).compile();

    tasksService = moduleRef.get(TasksService);
  });

  it("should be defined", () => {
    expect(tasksService).toBeDefined()
  })

  it("should create a task", async () => {
    // Add your test logic here
  });
});

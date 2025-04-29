import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTasksDto } from './dto/tasks.dto';
import { TASK_STATES } from '../lib/constants/tasks/tasks.constants';

// Mock PrismaService fully typed via casting
const mockPrismaService = {
  community: { findFirst: jest.fn(), findMany: jest.fn() },
  member: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  image: { create: jest.fn(), findMany: jest.fn() },
  task: { findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  memberTask: { create: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
  pointsMember: { findFirst: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(),
  handlePrismaError: ((_: string, error: unknown) => { throw error; }),
} as unknown as PrismaService;

// Minimal SupabaseService mock
const mockSupabaseService: Partial<SupabaseService> = {
  getAdminClient: jest.fn().mockReturnValue({
    storage: { from: jest.fn().mockReturnValue({ createSignedUrl: jest.fn().mockResolvedValue({ data: 'url', error: null }) }) }
  }) as any,
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
  });

  // === createTask ===
  describe('createTask', () => {
    const dto: CreateTasksDto = { tittle: 'T', description: 'D', difficulty: '1', location: 'L', communityName: 'C' };
    const userId = 'u'; const imageName = 'img.png';

    it('errors: no community', async () => {
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.createTask(dto, userId, imageName)).rejects.toThrow(HttpException);
    });

    it('errors: no member', async () => {
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.createTask(dto, userId, imageName)).rejects.toThrow(HttpException);
    });

    it('success', async () => {
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      (mockPrismaService.image!.create as jest.Mock).mockResolvedValue({ id: 10 });
      (mockPrismaService.task!.create as jest.Mock).mockResolvedValue({ id: 20 });
      (mockPrismaService.memberTask!.create as jest.Mock).mockResolvedValue({ id: 30 });
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(fn => fn());
      await expect(service.createTask(dto, userId, imageName)).resolves.toBe(true);
    });
  });

  // === assignTask ===
  describe('assignTask', () => {
    const u = 'u'; const tId = 1;

    it('errors: no task', async () => {
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.assignTask(u, tId)).rejects.toThrow(HttpException);
    });

    it('errors: no creator', async () => {
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue({ id: tId, creatorId: 5 });
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.assignTask(u, tId)).rejects.toThrow(HttpException);
    });

    it('errors: community missing', async () => {
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue({ id: tId, creatorId: 5 });
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue({ id: 5, communityId: 2 });
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.assignTask(u, tId)).rejects.toThrow(HttpException);
    });

    it('errors: user not member', async () => {
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue({ id: tId, creatorId: 5 });
      (mockPrismaService.member!.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 5, communityId: 2 })
        .mockResolvedValueOnce(null);
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      await expect(service.assignTask(u, tId)).rejects.toThrow(HttpException);
    });

    it('errors: already accepted', async () => {
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue({ id: tId, creatorId: 5 });
      (mockPrismaService.member!.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 5, communityId: 2 })
        .mockResolvedValueOnce({ id: 6, communityId: 2 });
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      jest.spyOn(service as any, 'verifyAssignTask').mockResolvedValue(false);
      await expect(service.assignTask(u, tId)).rejects.toThrow(HttpException);
    });

    it('success', async () => {
      const mtask = { id: 7 };
      (mockPrismaService.task!.findFirst as jest.Mock).mockResolvedValue({ id: tId, creatorId: 5 });
      (mockPrismaService.member!.findFirst as jest.Mock)
        .mockResolvedValueOnce({ id: 5, communityId: 2 })
        .mockResolvedValueOnce({ id: 6, communityId: 2 });
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      jest.spyOn(service as any, 'verifyAssignTask').mockResolvedValue(true);
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue(mtask);
      await service.assignTask(u, tId);
      expect(mockPrismaService.memberTask!.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: mtask.id } })
      );
    });
  });

  // === finishTask ===
  describe('finishTask', () => {
    it('errors: invalid id', async () => {
      await expect(service.finishTask(null as any)).rejects.toThrow(HttpException);
    });
    it('errors: no memberTask', async () => {
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.finishTask(1)).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      await service.finishTask(1);
      expect(mockPrismaService.memberTask!.update).toHaveBeenCalled();
    });
  });

  // === evaluateTask ===
  describe('evaluateTask', () => {
    it('errors: invalid id', async () => {
      await expect(service.evaluateTask(null as any, 5)).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      await service.evaluateTask(1, 4);
      expect(mockPrismaService.memberTask!.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 }, data: { score: 4, status: TASK_STATES.EVALUATED } })
      );
    });
  });

  // === assignBonus ===
  describe('assignBonus', () => {
    it('errors: no memberTask', async () => {
      (mockPrismaService.memberTask!.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.assignBonus(1, 3)).rejects.toThrow(HttpException);
    });
    it('errors: no member', async () => {
      (mockPrismaService.memberTask!.findUnique as jest.Mock).mockResolvedValue({ id:1, volunteerId:5, Task:{ difficulty:1 }} as any);
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.assignBonus(1,3)).rejects.toThrow(HttpException);
    });
    it('errors: no pointsMember', async () => {
      (mockPrismaService.memberTask!.findUnique as jest.Mock).mockResolvedValue({ id:1, volunteerId:5, Task:{ difficulty:1 }} as any);
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue({ id:5 } as any);
      (mockPrismaService.pointsMember!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.assignBonus(1,3)).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      (mockPrismaService.memberTask!.findUnique as jest.Mock).mockResolvedValue({ id:1, volunteerId:5, Task:{ difficulty:1 }} as any);
      (mockPrismaService.member!.findFirst as jest.Mock).mockResolvedValue({ id:5 } as any);
      (mockPrismaService.pointsMember!.findFirst as jest.Mock).mockResolvedValue({ id:2 } as any);
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(fn => fn());
      await service.assignBonus(1,3);
      expect(mockPrismaService.member!.update).toHaveBeenCalled();
      expect(mockPrismaService.pointsMember!.update).toHaveBeenCalled();
    });
  });

  // === GetTasksMemberDoing ===
  describe('GetTasksMemberDoing', () => {
    it('errors: no membership', async () => {
      (mockPrismaService.member!.findMany as jest.Mock).mockResolvedValue([]);
      await expect(service.GetTasksMemberDoing('u')).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      const members = [{ id:1, communityId:2 }];
      (mockPrismaService.member!.findMany as jest.Mock).mockResolvedValue(members as any);
      (mockPrismaService.community!.findMany as jest.Mock).mockResolvedValue([{ communityName:'C' }] as any);
      (mockPrismaService.memberTask!.findMany as jest.Mock).mockResolvedValue([{ taskId:3, completedAt:null }] as any);
      (mockPrismaService.task!.findMany as jest.Mock).mockResolvedValue([{ id:3 }] as any);
      const result = await service.GetTasksMemberDoing('u');
      expect(result.tasks).toBeDefined();
    });
  });

  // === GetTasksMemberCreated ===
  describe('GetTasksMemberCreated', () => {
    it('errors: no membership', async () => {
      (mockPrismaService.member!.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.GetTasksMemberCreated('u')).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      const members = [{ id:1, communityId:2 }];
      (mockPrismaService.member!.findMany as jest.Mock).mockResolvedValue(members as any);
      (mockPrismaService.community!.findMany as jest.Mock).mockResolvedValue([{ communityName:'C' }] as any);
      (mockPrismaService.task!.findMany as jest.Mock).mockResolvedValue([{ id:3, creatorId:1 }] as any);
      (mockPrismaService.memberTask!.findMany as jest.Mock).mockResolvedValue([{ taskId:3, score:null }] as any);
      (mockPrismaService.task!.findMany as jest.Mock).mockResolvedValue([{ id:3 }] as any);
      const result = await service.GetTasksMemberCreated('u');
      expect(result.tasks).toBeDefined();
    });
  });

  // === getTaskBeDoneCommunity ===
  describe('getTaskBeDoneCommunity', () => {
    it('errors: no community', async () => {
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getTaskBeDoneCommunity('C')).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      (mockPrismaService.community!.findFirst as jest.Mock).mockResolvedValue({ id:2 } as any);
      (mockPrismaService.member!.findMany as jest.Mock).mockResolvedValue([{ id:1 }] as any);
      (mockPrismaService.task!.findMany as jest.Mock).mockResolvedValue([{ id:3, imageId:4 }] as any);
      (mockPrismaService.memberTask!.findMany as jest.Mock).mockResolvedValue([{ taskId:3, assignedAt:null }] as any);
      (mockPrismaService.image!.findMany as jest.Mock).mockResolvedValue([{ id:4, imagePath:'p' }] as any);
      const result = await service.getTaskBeDoneCommunity('C');
      expect(result.tasks).toBeDefined();
    });
  });

  // === DeleteTask ===
  describe('DeleteTask', () => {
    it('errors: no task', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.DeleteTask(1)).rejects.toThrow(HttpException);
    });
    it('errors: already completed', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue({ id:1 } as any);
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.DeleteTask(1)).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue({ id:1 } as any);
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue({ id:2 } as any);
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(fn => fn());
      await service.DeleteTask(1);
      expect(mockPrismaService.memberTask!.delete).toHaveBeenCalled();
      expect(mockPrismaService.task!.delete).toHaveBeenCalled();
    });
  });

  // === CancelTask ===
  describe('CancelTask', () => {
    it('errors: no task', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.CancelTask(1)).rejects.toThrow(HttpException);
    });
    it('errors: already completed', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue({ id:1 } as any);
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.CancelTask(1)).rejects.toThrow(HttpException);
    });
    it('success', async () => {
      (mockPrismaService.task!.findUnique as jest.Mock).mockResolvedValue({ id:1 } as any);
      (mockPrismaService.memberTask!.findFirst as jest.Mock).mockResolvedValue({ id:2 } as any);
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(fn => fn());
      await service.CancelTask(1);
      expect(mockPrismaService.memberTask!.update).toHaveBeenCalled();
    });
  });
});

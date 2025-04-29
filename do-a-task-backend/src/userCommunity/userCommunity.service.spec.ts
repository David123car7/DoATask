import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UserCommunityService } from './userCommunity.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

const mockPrismaService = {
  userCommunity: {
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  handlePrismaError: jest.fn(),
} as unknown as PrismaService;

const mockSupabaseService: Partial<SupabaseService> = {};

describe('UserCommunityService', () => {
  let service: UserCommunityService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCommunityService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<UserCommunityService>(UserCommunityService);
  });

  // === CreateUserCommunity ===
  describe('CreateUserCommunity', () => {
    const userId = 'user1';
    const communityId = 123;

    it('successfully creates userCommunity', async () => {
      (mockPrismaService.userCommunity.create as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(service.CreateUserCommunity(userId, communityId)).resolves.toBeUndefined();
      expect(mockPrismaService.userCommunity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            userId,
            communityId,
            joinedAt: expect.any(Date),
          }
        })
      );
    });

    it('handles Prisma error on create', async () => {
      const error = new Error('create failure');
      (mockPrismaService.userCommunity.create as jest.Mock).mockRejectedValue(error);

      await service.CreateUserCommunity(userId, communityId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Create user community', error);
    });
  });

  // === DeleteUserCommunity ===
  describe('DeleteUserCommunity', () => {
    const userId = 'user2';
    const communityId = 456;

    it('throws if userCommunity not found', async () => {
      (mockPrismaService.userCommunity.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.DeleteUserCommunity(userId, communityId)).rejects.toThrow(HttpException);
      expect(mockPrismaService.userCommunity.findFirst).toHaveBeenCalledWith(
        { where: { userId, communityId } }
      );
    });

    it('successfully deletes userCommunity', async () => {
      const uc = { id: 10 };
      (mockPrismaService.userCommunity.findFirst as jest.Mock).mockResolvedValue(uc);
      (mockPrismaService.userCommunity.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.DeleteUserCommunity(userId, communityId)).resolves.toBeUndefined();
      expect(mockPrismaService.userCommunity.delete).toHaveBeenCalledWith(
        { where: { id: uc.id } }
      );
    });

    it('handles Prisma error on delete', async () => {
      const uc = { id: 20 };
      const error = new Error('delete failure');
      (mockPrismaService.userCommunity.findFirst as jest.Mock).mockResolvedValue(uc);
      (mockPrismaService.userCommunity.delete as jest.Mock).mockRejectedValue(error);

      await service.DeleteUserCommunity(userId, communityId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Delete user community', error);
    });
  });
});

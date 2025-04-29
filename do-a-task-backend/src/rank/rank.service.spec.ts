import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { RankService } from './rank.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

// Fully typed PrismaService mock
const mockPrismaService = {
  community: { findFirst: jest.fn() },
  member: { findMany: jest.fn(), findFirst: jest.fn() },
  user: { findUnique: jest.fn() },
  pointsMember: { findMany: jest.fn(), findFirst: jest.fn() },
} as unknown as PrismaService;

const mockSupabaseService: Partial<SupabaseService> = {};

describe('RankService', () => {
  let service: RankService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<RankService>(RankService);
  });

  // === getRankCommunity ===
  describe('getRankCommunity', () => {
    const communityName = 'MyComm';

    it('throws if community not found', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getRankCommunity(communityName)).rejects.toThrow(HttpException);
    });

    it('throws if no members', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.getRankCommunity(communityName)).rejects.toThrow(HttpException);
    });

    it('returns ordered rank array', async () => {
      const community = { id: 1 };
      const members = [{ id: 10 }, { id: 20 }];
      const ranks = [
        { points: 200, member: { user: { name: 'Alice' } } },
        { points: 100, member: { user: { name: 'Bob' } } },
      ];

      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(community);
      (mockPrismaService.member.findMany as jest.Mock).mockResolvedValue(members);
      (mockPrismaService.pointsMember.findMany as jest.Mock).mockResolvedValue(ranks);

      const result = await service.getRankCommunity(communityName);
      expect(Array.isArray(result.rank)).toBe(true);
      expect(result.rank).toEqual(ranks);
      expect((mockPrismaService.pointsMember.findMany as jest.Mock)).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { memberId: { in: members.map(m => m.id) } },
          orderBy: { points: 'desc' },
          select: { points: true, member: { select: { user: { select: { name: true } } } } },
        }),
      );
    });
  });

  // === getUserPoints ===
  describe('getUserPoints', () => {
    const userId = 'user1';
    const communityName = 'CommX';

    it('throws if community not found', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserPoints(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('throws if user not found', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 5 });
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserPoints(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('throws if member not found', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 5 });
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserPoints(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('returns pointsMember on success', async () => {
      const community = { id: 5 };
      const user = { id: userId };
      const member = { id: 7, communityId: community.id };
      const pointsRecord = { points: 123 };

      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(community);
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(member);
      (mockPrismaService.pointsMember.findFirst as jest.Mock).mockResolvedValue(pointsRecord);

      const result = await service.getUserPoints(userId, communityName);
      expect(result).toEqual({ pointsMember: pointsRecord });
      expect((mockPrismaService.pointsMember.findFirst as jest.Mock)).toHaveBeenCalledWith(
        expect.objectContaining({ where: { memberId: member.id }, select: { points: true } }),
      );
    });
  });
});

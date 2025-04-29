import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { MemberService } from './member.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

const mockPrismaService = {
  member: { findFirst: jest.fn(), create: jest.fn(), delete: jest.fn() },
  pointsMember: { findFirst: jest.fn(), create: jest.fn(), delete: jest.fn() },
  community: { findFirst: jest.fn() },
  $transaction: jest.fn(),
  handlePrismaError: jest.fn(),
} as unknown as PrismaService;

const mockSupabaseService: Partial<SupabaseService> = {};

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  // === createMember ===
  describe('createMember', () => {
    const userId = 'user123';
    const communityId = 10;

    it('throws if user is already a member', async () => {
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      await expect(service.createMember(userId, communityId)).rejects.toThrow(HttpException);
      expect(mockPrismaService.member.findFirst).toHaveBeenCalledWith({ where: { userId } });
    });

    it('creates member and pointsMember in transaction', async () => {
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      const createdMember = { id: 2, userId, communityId, coins: 0 };
      const createdPoints = { id: 3, memberId: 2, points: 0 };

      (mockPrismaService.$transaction as jest.Mock).mockImplementation(async fn => fn());
      (mockPrismaService.member.create as jest.Mock).mockResolvedValue(createdMember);
      (mockPrismaService.pointsMember.create as jest.Mock).mockResolvedValue(createdPoints);

      await expect(service.createMember(userId, communityId)).resolves.toBeUndefined();
      expect(mockPrismaService.member.create).toHaveBeenCalledWith({ data: { userId, communityId, coins: 0 } });
      expect(mockPrismaService.pointsMember.create).toHaveBeenCalledWith({ data: { memberId: createdMember.id, points: 0 } });
    });

    it('handles prisma error on creation', async () => {
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      const error = new Error('fail');
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(async () => { throw error; });

      await service.createMember(userId, communityId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Creating Member', error);
    });
  });

  // === DeleteMember ===
  describe('DeleteMember', () => {
    const userId = 'user123';
    const communityId = 20;

    it('throws if no member found', async () => {
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.DeleteMember(userId, communityId)).rejects.toThrow(HttpException);
    });

    it('throws if no pointsMember found', async () => {
      const member = { id: 5 };
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(member);
      (mockPrismaService.pointsMember.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.DeleteMember(userId, communityId)).rejects.toThrow(HttpException);
    });

    it('deletes pointsMember and member in transaction', async () => {
      const member = { id: 5 };
      const pm = { id: 6, memberId: 5 };
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(member);
      (mockPrismaService.pointsMember.findFirst as jest.Mock).mockResolvedValue(pm);
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(async fn => fn());

      await expect(service.DeleteMember(userId, communityId)).resolves.toBeUndefined();
      expect(mockPrismaService.pointsMember.delete).toHaveBeenCalledWith({ where: { id: pm.id } });
      expect(mockPrismaService.member.delete).toHaveBeenCalledWith({ where: { id: member.id } });
    });

    it('handles prisma error on deletion', async () => {
      const member = { id: 5 };
      const pm = { id: 6 };
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(member);
      (mockPrismaService.pointsMember.findFirst as jest.Mock).mockResolvedValue(pm);
      const error = new Error('fail delete');
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(async () => { throw error; });

      await service.DeleteMember(userId, communityId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Delete Member', error);
    });
  });

  // === GetMemberCoins ===
  describe('GetMemberCoins', () => {
    const userId = 'userABC';
    const communityName = 'CommZ';

    it('throws if community not found', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.GetMemberCoins(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('throws if user not member', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 7 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.GetMemberCoins(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('returns member coins', async () => {
      const community = { id: 7 };
      const member = { coins: 42 };
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(community);
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(member);

      const result = await service.GetMemberCoins(userId, communityName);
      expect(result).toEqual(member);
      expect(mockPrismaService.member.findFirst).toHaveBeenCalledWith({
        where: { userId, communityId: community.id }, select: { coins: true }
      });
    });
  });
});

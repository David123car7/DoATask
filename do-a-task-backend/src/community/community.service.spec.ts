import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { CommunityService } from './community.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AddressService } from '../addresses/addresses.service';
import { MemberService } from '../member/member.service';
import { UserCommunityService } from '../userCommunity/userCommunity.service';
import { StoreService } from '../store/store.service';
import { CreateCommunityDto } from './dto/community.dto';

describe('CommunityService', () => {
  let service: CommunityService;

  // Mock dependencies
  const mockPrisma: Partial<PrismaService> = {
    community: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    } as any,
    locality: { findFirst: jest.fn() } as any,
    userCommunity: { findMany: jest.fn(), findFirst: jest.fn() } as any,
    member: { findMany: jest.fn(), count: jest.fn() } as any,
    $transaction: jest.fn(),
    handlePrismaError: jest.fn().mockImplementation((ctx, err) => { throw err; }),
  } as any;

  const mockSupabase: Partial<SupabaseService> = {} as any;
  const mockAddress: Partial<AddressService> = { VefifyAdressses: jest.fn() } as any;
  const mockMember: Partial<MemberService> = { createMember: jest.fn(), DeleteMember: jest.fn() } as any;
  const mockUserComm: Partial<UserCommunityService> = { CreateUserCommunity: jest.fn(), DeleteUserCommunity: jest.fn() } as any;
  const mockStore: Partial<StoreService> = { createStore: jest.fn() } as any;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: AddressService, useValue: mockAddress },
        { provide: MemberService, useValue: mockMember },
        { provide: UserCommunityService, useValue: mockUserComm },
        { provide: StoreService, useValue: mockStore },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
  });

  describe('createCommunity', () => {
    const dto: CreateCommunityDto = { communityName: 'Name', location: 'Loc' };
    const userId = 'user1';

    it('throws if user already has a community', async () => {
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([{}]);
      await expect(service.createCommunity(dto, userId)).rejects.toThrow(HttpException);
    });

    it('throws if name exists', async () => {
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({});
      await expect(service.createCommunity(dto, userId)).rejects.toThrow(HttpException);
    });

    it('throws if locality not found', async () => {
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.locality!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.createCommunity(dto, userId)).rejects.toThrow(HttpException);
    });

    it('creates successfully', async () => {
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.locality!.findFirst as jest.Mock).mockResolvedValue({ id: 5 } as any);
      (mockPrisma.community!.create as jest.Mock).mockResolvedValue({ id: 5 } as any);
      (mockPrisma.$transaction as jest.Mock).mockImplementation(async fn => fn(mockPrisma));

      await expect(service.createCommunity(dto, userId)).resolves.toBeUndefined();
      expect(mockPrisma.community!.create).toHaveBeenCalledWith(expect.objectContaining({ data: { communityName: 'Name', localityId: 5, creatorId: userId } }));
      expect(mockStore.createStore).toHaveBeenCalledWith(5);
    });
  });

  describe('GetUserCommunities', () => {
    const userId = 'u1';

    it('throws if none', async () => {
      (mockPrisma.userCommunity!.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.GetUserCommunities(userId)).rejects.toThrow(HttpException);
    });

    it('returns data', async () => {
      (mockPrisma.userCommunity!.findMany as jest.Mock).mockResolvedValue([{ communityId: 2 }]);
      (mockPrisma.member!.findMany as jest.Mock).mockResolvedValue([{ Community: { communityName: 'C', Locality: { name: 'N' } }, PointsMember: {}, coins: 0 }]);
      jest.spyOn(service, 'CountMembers').mockResolvedValue(3 as any);

      const res = await service.GetUserCommunities(userId);
      expect(res.communities).toHaveLength(1);
      expect(res.membersCount).toEqual([3]);
    });
  });

  describe('GetUserCommunitiesNames', () => {
    const userId = 'u2';

    it('throws if none', async () => {
      (mockPrisma.userCommunity!.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.GetUserCommunitiesNames(userId)).rejects.toThrow(HttpException);
    });

    it('returns names', async () => {
      (mockPrisma.userCommunity!.findMany as jest.Mock).mockResolvedValue([{ communityId: 7 }]);
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([{ communityName: 'X' }]);

      const names = await service.GetUserCommunitiesNames(userId);
      expect(names).toEqual([{ communityName: 'X' }]);
    });
  });

  describe('GetAllCommunitiesWithLocality', () => {
    const userId = 'u3';

    it('filters by locality and counts', async () => {
      (mockPrisma.userCommunity!.findMany as jest.Mock).mockResolvedValue([{ communityId: 1 }]);
      (mockPrisma.community!.findMany as jest.Mock).mockResolvedValue([{ communityName: 'A', Locality: { minPostalNumber: 1, maxPostalNumber: 5 } } as any]);
      (mockAddress.VefifyAdressses as jest.Mock).mockResolvedValue([{}]);
      jest.spyOn(service, 'CountMembers').mockResolvedValue(2 as any);

      const out = await service.GetAllCommunitiesWithLocality(userId);
      expect(out.communities).toHaveLength(1);
      expect(out.membersCount).toEqual([2]);
    });
  });

  describe('CountMembers', () => {
    it('throws if no community found', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.CountMembers('CN')).rejects.toThrow(HttpException);
    });

    it('returns count when community exists', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({ id: 10 } as any);
      (mockPrisma.member!.count as jest.Mock).mockResolvedValue(4);

      const count = await service.CountMembers('CN');
      expect(count).toBe(4);
      expect(mockPrisma.member!.count).toHaveBeenCalledWith({ where: { communityId: 10 } });
    });
  });

  describe('UserEnterCommunity', () => {
    const userId = 'ux'; const name = 'N';

    it('errors: not exist', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.UserEnterCommunity(userId, name)).rejects.toThrow(HttpException);
    });

    it('errors: already in', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({ id: 5, Locality: {} } as any);
      jest.spyOn(service, 'CheckUserBelongsCommunity').mockResolvedValue(true as any);
      await expect(service.UserEnterCommunity(userId, name)).rejects.toThrow(HttpException);
    });

    it('errors: no address', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({ id: 5, Locality: { minPostalNumber: 0, maxPostalNumber: 10 } } as any);
      jest.spyOn(service, 'CheckUserBelongsCommunity').mockResolvedValue(false as any);
      (mockAddress.VefifyAdressses as jest.Mock).mockResolvedValue(null);
      await expect(service.UserEnterCommunity(userId, name)).rejects.toThrow(HttpException);
    });

    it('enters successfully', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({ id: 5, Locality: { minPostalNumber: 0, maxPostalNumber: 10 } } as any);
      jest.spyOn(service, 'CheckUserBelongsCommunity').mockResolvedValue(false as any);
      (mockAddress.VefifyAdressses as jest.Mock).mockResolvedValue([{}]);
      (mockPrisma.$transaction as jest.Mock).mockImplementation(fn => fn(mockPrisma));

      await expect(service.UserEnterCommunity(userId, name)).resolves.toBeUndefined();
      expect(mockUserComm.CreateUserCommunity).toHaveBeenCalledWith(userId, 5);
      expect(mockMember.createMember).toHaveBeenCalledWith(userId, 5);
    });
  });

  describe('ExitCommunity', () => {
    const userId = 'u4'; const name = 'C4';

    it('errors: not exist', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.ExitCommunity(userId, name)).rejects.toThrow(HttpException);
    });

    it('exits successfully', async () => {
      (mockPrisma.community!.findFirst as jest.Mock).mockResolvedValue({ id: 9 } as any);
      (mockPrisma.$transaction as jest.Mock).mockImplementation(fn => fn(mockPrisma));

      await expect(service.ExitCommunity(userId, name)).resolves.toBeUndefined();
      expect(mockMember.DeleteMember).toHaveBeenCalledWith(userId, 9);
      expect(mockUserComm.DeleteUserCommunity).toHaveBeenCalledWith(userId, 9);
    });
  });

  describe('CheckUserBelongsCommunity', () => {
    beforeEach(() => jest.clearAllMocks());

    it('returns false if none', async () => {
      (mockPrisma.userCommunity!.findFirst as jest.Mock).mockResolvedValue(null);
      const res = await service.CheckUserBelongsCommunity('x', 1);
      expect(res).toBe(false);
    });

    it('returns true if found', async () => {
      (mockPrisma.userCommunity!.findFirst as jest.Mock).mockResolvedValue({} as any);
      const res = await service.CheckUserBelongsCommunity('x', 1);
      expect(res).toBe(true);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { StoreService } from './store.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BUCKETS } from '../lib/constants/storage/buckets';

// Fully typed PrismaService mock
const mockPrismaService = {
  community: { findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn() },
  store: { findFirst: jest.fn(), create: jest.fn() },
  image: { create: jest.fn(), findMany: jest.fn() },
  item: { findFirst: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  member: { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() },
  purchase: { findMany: jest.fn(), create: jest.fn() },
  $transaction: jest.fn(),
  handlePrismaError: jest.fn(),
} as unknown as PrismaService;

// Minimal SupabaseService mock
const mockSupabaseService: Partial<SupabaseService> = {
  getAdminClient: jest.fn().mockReturnValue({
    storage: { from: jest.fn().mockReturnValue({ createSignedUrl: jest.fn().mockResolvedValue({ data: 'signed-url', error: null }) }) }
  }),
};

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  // === createItem ===
  describe('createItem', () => {
    const userId = 'user1';
    const itemName = 'Widget';
    const itemPrice = 100;
    const stock = 5;
    const imageName = 'img.png';

    it('errors if store not found', async () => {
      // getUserStore: community then store
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.createItem(userId, itemName, itemPrice, stock, imageName))
        .rejects.toThrow(HttpException);
    });

    it('errors if item already exists', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 10 });
      (mockPrismaService.item.findFirst as jest.Mock).mockResolvedValue({ id: 2 });
      await expect(service.createItem(userId, itemName, itemPrice, stock, imageName))
        .rejects.toThrow(HttpException);
    });

    it('successfully creates item', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 10 });
      (mockPrismaService.item.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrismaService.image.create as jest.Mock).mockResolvedValue({ id: 20 });
      (mockPrismaService.item.create as jest.Mock).mockResolvedValue({ id: 30 });
      (mockPrismaService.$transaction as jest.Mock).mockImplementation((cb) => cb());

      await expect(service.createItem(userId, itemName, itemPrice, stock, imageName)).resolves.toBeUndefined();
      expect(mockPrismaService.image.create).toHaveBeenCalledWith(expect.objectContaining({ data: { imagePath: `${userId}/${itemName}/${imageName}` } }));
      expect(mockPrismaService.item.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ name: itemName }) }));
    });
  });

  // === hideItem ===
  describe('hideItem', () => {
    const userId = 'user1';
    const itemId = 42;

    it('errors if item does not exist', async () => {
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.hideItem(userId, itemId)).rejects.toThrow(HttpException);
    });

    it('successfully hides item', async () => {
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue({ id: itemId });
      await expect(service.hideItem(userId, itemId)).resolves.toBeUndefined();
      expect(mockPrismaService.item.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: itemId }, data: { available: false } }));
    });
  });

  // === showItem ===
  describe('showItem', () => {
    const userId = 'user1';
    const itemId = 99;

    it('errors if item does not exist', async () => {
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.showItem(userId, itemId)).rejects.toThrow(HttpException);
    });

    it('successfully shows item', async () => {
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue({ id: itemId });
      await expect(service.showItem(userId, itemId)).resolves.toBeUndefined();
      expect(mockPrismaService.item.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: itemId }, data: { available: true } }));
    });
  });

  // === createStore ===
  describe('createStore', () => {
    const communityId = 7;

    it('errors if community does not exist', async () => {
      (mockPrismaService.community.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.createStore(communityId)).rejects.toThrow(HttpException);
    });

    it('successfully creates store', async () => {
      (mockPrismaService.community.findUnique as jest.Mock).mockResolvedValue({ id: communityId });
      await expect(service.createStore(communityId)).resolves.toBeUndefined();
      expect(mockPrismaService.store.create).toHaveBeenCalledWith(expect.objectContaining({ data: { communityId } }));
    });
  });

  // === buyItem ===
  describe('buyItem', () => {
    const userId = 'u1';
    const communityName = 'CommX';
    const itemId = 5;

    it('errors if community does not exist', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('errors if user not member', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('errors if store does not exist', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, coins: 100 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('errors if item does not exist in store', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, coins: 100 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('errors if out of stock', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, coins: 100 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue({ id: itemId, price: 50, stock: 0 });
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('errors if insufficient coins', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, coins: 10 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue({ id: itemId, price: 50, stock: 5 });
      await expect(service.buyItem(userId, communityName, itemId)).rejects.toThrow(HttpException);
    });

    it('successfully buys item', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, coins: 100 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 3 });
      (mockPrismaService.item.findUnique as jest.Mock).mockResolvedValue({ id: itemId, price: 50, stock: 5 });
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(cb => cb());

      await expect(service.buyItem(userId, communityName, itemId)).resolves.toBeUndefined();
      expect(mockPrismaService.member.update).toHaveBeenCalled();
      expect(mockPrismaService.item.update).toHaveBeenCalled();
      expect(mockPrismaService.purchase.create).toHaveBeenCalled();
    });
  });

  // === getUserStore ===
  describe('getUserStore', () => {
    const userId = 'u-store';

    it('errors if user has no community', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserStore(userId)).rejects.toThrow(HttpException);
    });

    it('errors if community has no store', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserStore(userId)).rejects.toThrow(HttpException);
    });

    it('successfully returns store', async () => {
      const store = { id: 99 };
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue(store);
      await expect(service.getUserStore(userId)).resolves.toEqual(store);
    });
  });

  // === getMemberPurchases ===
  describe('getMemberPurchases', () => {
    const userId = 'buyer1';

    it('errors if no members found', async () => {
      (mockPrismaService.member.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.getMemberPurchases(userId)).rejects.toThrow(HttpException);
    });

    it('errors if no purchases', async () => {
      (mockPrismaService.member.findMany as jest.Mock).mockResolvedValue([{ id: 1, communityId: 2 }]);
      (mockPrismaService.purchase.findMany as jest.Mock).mockResolvedValue(null);
      await expect(service.getMemberPurchases(userId)).rejects.toThrow(HttpException);
    });

    it('successfully returns purchases with communities', async () => {
      const members = [{ id: 1, communityId: 2 }];
      const purchases = [{ memberId: 1, itemId: 3 }];
      const communities = [{ id: 2, communityName: 'Comm' }];

      (mockPrismaService.member.findMany as jest.Mock).mockResolvedValue(members);
      (mockPrismaService.purchase.findMany as jest.Mock).mockResolvedValue(purchases.map(p => ({ ...p, Item: {} }))); 
      (mockPrismaService.community.findMany as jest.Mock).mockResolvedValue(communities);

      const result = await service.getMemberPurchases(userId);
      expect(result.purchases).toHaveLength(1);
      expect(result.communities).toHaveLength(1);
    });
  });

  // === getCommunityItems ===
  describe('getCommunityItems', () => {
    const userId = 'uC';
    const communityName = 'CommA';

    it('errors if community not exist', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getCommunityItems(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('errors if user not member', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getCommunityItems(userId, communityName)).rejects.toThrow(HttpException);
    });

    it('successfully retrieves items with URLs', async () => {
      const items = [{ id: 3, imageId: 8 }];
      const images = [{ id: 8, imagePath: 'path.png' }];
      
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.member.findFirst as jest.Mock).mockResolvedValue({ id: 2, communityId: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 4 });
      (mockPrismaService.item.findMany as jest.Mock).mockResolvedValue(items);
      (mockPrismaService.image.findMany as jest.Mock).mockResolvedValue(images);

      const result = await service.getCommunityItems(userId, communityName);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('imageUrl', 'signed-url');
      expect(mockSupabaseService.getAdminClient().storage.from).toHaveBeenCalledWith(BUCKETS.ITEM_IMAGES);
    });
  });

  // === getMemberShopItems ===
  describe('getMemberShopItems', () => {
    const userId = 'creator1';

    it('errors if user has no community', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getMemberShopItems(userId)).rejects.toThrow(HttpException);
    });

    it('errors if community has no store', async () => {
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getMemberShopItems(userId)).rejects.toThrow(HttpException);
    });

    it('successfully retrieves shop items with URLs', async () => {
      const items = [{ id: 5, imageId: 9 }];
      const images = [{ id: 9, imagePath: 'img9.png' }];
      
      (mockPrismaService.community.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrismaService.store.findFirst as jest.Mock).mockResolvedValue({ id: 6 });
      (mockPrismaService.item.findMany as jest.Mock).mockResolvedValue(items);
      (mockPrismaService.image.findMany as jest.Mock).mockResolvedValue(images);

      const result = await service.getMemberShopItems(userId);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('imageUrl', 'signed-url');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LocalityService } from './locality.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

const mockPrismaService = {
  locality: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  handlePrismaError: jest.fn(),
} as unknown as PrismaService;

const mockSupabaseService: Partial<SupabaseService> = {};

describe('LocalityService', () => {
  let service: LocalityService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalityService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<LocalityService>(LocalityService);
  });

  describe('getLocalityDataById', () => {
    const localityId = 42;
    const simpleRecord = { id: localityId, name: 'Testville', Community: { id: 1 } };

    it('throws if locality not found on first lookup', async () => {
      (mockPrismaService.locality.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(service.getLocalityDataById(localityId)).rejects.toThrow(HttpException);
      try {
        await service.getLocalityDataById(localityId);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((e as HttpException).message).toBe('Locality does not exist');
      }
      expect(mockPrismaService.locality.findFirst).toHaveBeenCalledWith({ where: { id: localityId } });
    });

    it('returns data when found', async () => {
      (mockPrismaService.locality.findFirst as jest.Mock).mockResolvedValue({ id: localityId });
      (mockPrismaService.locality.findUnique as jest.Mock).mockResolvedValue(simpleRecord);

      const result = await service.getLocalityDataById(localityId);
      expect(mockPrismaService.locality.findFirst).toHaveBeenCalledWith({ where: { id: localityId } });
      expect(mockPrismaService.locality.findUnique).toHaveBeenCalledWith({
        where: { id: localityId },
        select: { id: true, name: true, Community: true },
      });
      expect(result).toEqual(simpleRecord);
    });
  });
});
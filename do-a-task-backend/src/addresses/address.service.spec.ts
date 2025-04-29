import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AddressService } from './addresses.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/addresses.dto';

describe('AddressService', () => {
  let service: AddressService;

  // Mocks
  const mockSupabaseService = {} as Partial<SupabaseService>;

  const mockPrismaService = ({
    address: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    locality: {
      findFirst: jest.fn(),
    },
    handlePrismaError: jest.fn(),
  } as unknown) as PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  describe('createAddress', () => {
    const dto: CreateAddressDto = {
      port: 1,
      street: 'Main St',
      postalCode: '1000-01',
      locality: 'Loc1',
    };
    const userId = 'user1';

    it('throws if address already exists', async () => {
      mockPrismaService.address.findFirst = jest.fn().mockResolvedValue({ id: 1 });
      await expect(service.createAddress(dto, userId)).rejects.toThrow(
        new HttpException('The address allready exist', HttpStatus.BAD_REQUEST),
      );
    });

    it('throws if locality does not exist', async () => {
      mockPrismaService.address.findFirst = jest.fn().mockResolvedValue(null);
      mockPrismaService.locality.findFirst = jest.fn().mockResolvedValue(null);
      await expect(service.createAddress(dto, userId)).rejects.toThrow(
        new HttpException('The Locality does not exist', HttpStatus.BAD_REQUEST),
      );
    });

    it('creates and returns undefined on success', async () => {
      mockPrismaService.address.findFirst = jest.fn().mockResolvedValue(null);
      mockPrismaService.locality.findFirst = jest.fn().mockResolvedValue({ id: 2 });
      mockPrismaService.address.create = jest.fn().mockResolvedValue({ id: 3 });

      const res = await service.createAddress(dto, userId);
      expect(mockPrismaService.address.create).toHaveBeenCalledWith({ data: {
        port: dto.port,
        street: dto.street,
        postalCode: dto.postalCode,
        userId,
      }});
      expect(res).toBeUndefined();
    });

    it('handles prisma error during creation', async () => {
      mockPrismaService.address.findFirst = jest.fn().mockResolvedValue(null);
      mockPrismaService.locality.findFirst = jest.fn().mockResolvedValue({ id: 2 });
      const error = new Error('fail');
      mockPrismaService.address.create = jest.fn().mockRejectedValue(error);

      await service.createAddress(dto, userId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Create Adresses', error);
    });
  });

  describe('getAllAddresses', () => {
    const userId = 'user1';

    it('returns list of addresses', async () => {
      const addresses = [{ id: 1 }, { id: 2 }];
      mockPrismaService.address.findMany = jest.fn().mockResolvedValue(addresses);
      const res = await service.getAllAddresses(userId);
      expect(res).toEqual(addresses);
    });

    it('handles prisma error', async () => {
      const error = new Error('fail');
      mockPrismaService.address.findMany = jest.fn().mockRejectedValue(error);
      const res = await service.getAllAddresses(userId);
      expect(mockPrismaService.handlePrismaError).toHaveBeenCalledWith('Getting All Adresses', error);
      expect(res).toBeUndefined();
    });
  });

  describe('VefifyAdressses', () => {
    const userId = 'user1';

    it('throws if no addresses', async () => {
      jest.spyOn(service, 'getAllAddresses').mockResolvedValue(undefined);
      await expect(service.VefifyAdressses(userId, '1000', '1001')).rejects.toThrow(
        new HttpException('User does not contain addresses', HttpStatus.BAD_REQUEST),
      );
    });

    it('throws on invalid postal code inputs', async () => {
      jest.spyOn(service, 'getAllAddresses').mockResolvedValue([{ postalCode: 'abc' } as any]);
      await expect(service.VefifyAdressses(userId, 'aa', 'bb')).rejects.toThrow(
        new HttpException('Invalid postal codes provided', HttpStatus.BAD_REQUEST),
      );
    });

    it('returns filtered addresses in range', async () => {
      const addrs = [
        { postalCode: '1000-00' },
        { postalCode: '1000-50' },
        { postalCode: '1001-00' },
        { postalCode: '1002-00' },
      ] as any[];
      jest.spyOn(service, 'getAllAddresses').mockResolvedValue(addrs);
      const res = await service.VefifyAdressses(userId, '1000-00', '1001-00');
      expect(res).toEqual([
        { postalCode: '1000-00' },
        { postalCode: '1000-50' },
        { postalCode: '1001-00' },
      ]);
    });
  });
});

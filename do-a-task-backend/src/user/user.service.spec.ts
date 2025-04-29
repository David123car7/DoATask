import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ChangeUserDataDto } from './dto/user.dto';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  contact: {
    findUnique: jest.fn(),
  },
  handlePrismaError: jest.fn(),
} as unknown as PrismaService;

const mockSupabaseService: Partial<SupabaseService> = {};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // === getUserData ===
  describe('getUserData', () => {
    const userId = 'user1';
    const userRecord = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      birthDate: new Date('1990-01-01'),
      contactId: 99,
    };

    it('throws if user not found', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserData(userId)).rejects.toThrow(HttpException);
    });

    it('throws if contact not found', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(userRecord);
      (mockPrismaService.contact.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getUserData(userId)).rejects.toThrow(HttpException);
    });

    it('returns combined user and contact data', async () => {
      const contactRecord = { id: 99, number: '123-456-7890' };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(userRecord);
      (mockPrismaService.contact.findUnique as jest.Mock).mockResolvedValue(contactRecord);

      const result = await service.getUserData(userId);
      expect(result).toEqual({
        user: {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          birthDate: userRecord.birthDate,
        },
        contact: {
          number: contactRecord.number,
        },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockPrismaService.contact.findUnique).toHaveBeenCalledWith({ where: { id: userRecord.contactId } });
    });
  });

  // === changeUserData ===
  describe('changeUserData', () => {
    const userId = 'user2';
    const dto: ChangeUserDataDto = { name: 'Jane Doe', birthDate: new Date('1985-05-05').toDateString(), number: '987-654-3210' };

    it('throws if user not found', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.changeUserData(dto, userId)).rejects.toThrow(HttpException);
    });

    it('updates user and contact on success', async () => {
      const existingUser = { id: userId, contactId: 55 };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (mockPrismaService.user.update as jest.Mock).mockResolvedValue({ ...existingUser, name: dto.name, birthDate: dto.birthDate });

      await expect(service.changeUserData(dto, userId)).resolves.toBeUndefined();
      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: userId },
          data: {
            name: dto.name,
            birthDate: dto.birthDate,
            Contact: { update: { number: dto.number } },
          },
        }),
      );
    });
  });
});
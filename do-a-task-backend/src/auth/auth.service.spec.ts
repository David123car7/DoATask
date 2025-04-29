import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  AuthDtoSignup,
  AuthDtoSignin,
  AuthDtoChangePassword,
  AuthDtoRequestResetPassword,
  AuthDtoResetPassword,
} from './dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuthClient = {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      refreshSession: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
    },
  } as any;

  const mockAdminClient = {
    auth: {
      admin: {
        updateUserById: jest.fn(),
      },
    },
  } as any;

  const mockSupabaseService = ({
    getPublicClient: jest.fn().mockReturnValue(mockAuthClient),
    getAdminClient: jest.fn().mockReturnValue(mockAdminClient),
    handleSupabaseError: jest.fn(),
  } as unknown) as Partial<SupabaseService>;

  const mockPrismaService = ({
    $transaction: jest.fn(),
    contact: { create: jest.fn() },
    user: { create: jest.fn() },
  } as unknown) as PrismaService;

  const mockNotificationsService = {} as Partial<NotificationsService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    const dto: AuthDtoSignup = {
      email: 'a@b.com',
      password: 'pass',
      name: 'Name',
      contactNumber: '123',
      birthDate: new Date('1990-01-01').toDateString(),
    };
    const supaUser = { id: 'u1' };

    it('creates contact and user and returns result', async () => {
      mockAuthClient.auth.signUp.mockResolvedValue({ data: { user: supaUser }, error: null });
      (mockPrismaService.$transaction as jest.Mock).mockImplementation(async fn => fn(mockPrismaService));
      mockPrismaService.contact.create = jest.fn().mockResolvedValue({ id: 10 });
      mockPrismaService.user.create = jest.fn().mockResolvedValue({ id: supaUser.id });

      const result = await service.signup(dto);

      expect(mockPrismaService.contact.create).toHaveBeenCalledWith({ data: { number: dto.contactNumber } });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: expect.objectContaining({ id: supaUser.id, name: dto.name, email: dto.email }) });
      expect(result).toEqual({ message: 'Signup successful', user: supaUser });
    });
  });

  describe('signIn', () => {
    const dto: AuthDtoSignin = { email: 'a@b.com', password: 'pass' };
    it('returns user and session', async () => {
      const user = { id: 'u' };
      const session = { token: 't' };
      mockAuthClient.auth.signInWithPassword.mockResolvedValue({ data: { user, session }, error: null });
      const res = await service.signIn(dto);
      expect(res).toEqual({ user, session });
    });
  });

  describe('refreshSession', () => {
    it('returns new session', async () => {
      const user = { id: 'u' };
      const session = { token: 's' };
      mockAuthClient.auth.refreshSession.mockResolvedValue({ data: { user, session }, error: null });
      const res = await service.refreshSession('token');
      expect(res).toEqual({ user, session });
    });
  });

  describe('signout', () => {
    it('handles error', async () => {
      mockAuthClient.auth.signOut.mockResolvedValue({ error: new Error('out') });
      await service.signout();
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(expect.any(Error), 'SignOut User');
    });

    it('resolves without error', async () => {
      mockAuthClient.auth.signOut.mockResolvedValue({ error: null });
      await expect(service.signout()).resolves.toBeUndefined();
    });
  });

  describe('changePassword', () => {
    const email = 'a@b.com';
    const dto: AuthDtoChangePassword = { currentPassword: 'old', newPassword: 'new', newPassword2: 'new' };

    it('throws if mismatch', async () => {
      await expect(service.changePassword({ ...dto, newPassword2: 'diff' }, email)).rejects.toThrow(HttpException);
    });

    it('throws if same as old', async () => {
      await expect(service.changePassword({ currentPassword: 'p', newPassword: 'p', newPassword2: 'p' }, email)).rejects.toThrow(HttpException);
    });

    it('handles update error', async () => {
      mockAuthClient.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'u' } }, error: null });
      mockAuthClient.auth.updateUser.mockResolvedValue({ data: null, error: new Error('uerr') });
      await service.changePassword(dto, email);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(expect.any(Error), 'Change Password');
    });

    it('returns success message', async () => {
      mockAuthClient.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'u' } }, error: null });
      mockAuthClient.auth.updateUser.mockResolvedValue({ data: { user: { id: 'u' } }, error: null });
      const res = await service.changePassword(dto, email);
      expect(res).toEqual({ message: 'Passord changed successfully' });
    });
  });

  describe('requestResetPassword', () => {
    const dto: AuthDtoRequestResetPassword = { email: 'a@b.com' };

    it('handles error', async () => {
      mockAuthClient.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error: new Error('rp') });
      await service.requestResetPassword(dto);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(expect.any(Error), 'Request Reset Password');
    });

    it('returns message', async () => {
      mockAuthClient.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
      const res = await service.requestResetPassword(dto);
      expect(res).toEqual({ message: 'Password reset request successfull' });
    });
  });

  describe('resetPassword', () => {
    const dto: AuthDtoResetPassword = { newPassword: 'n', newPassword2: 'n' };
    const userId = 'u';

    it('throws on mismatch', async () => {
      await expect(service.resetPassword({ newPassword: 'a', newPassword2: 'b' }, userId)).rejects.toThrow(HttpException);
    });

    it('handles admin update error', async () => {
      mockAdminClient.auth.admin.updateUserById.mockResolvedValue({ data: null, error: new Error('err') });
      await service.resetPassword(dto, userId);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(expect.any(Error), 'Reset Password');
    });

    it('returns success message', async () => {
      mockAdminClient.auth.admin.updateUserById.mockResolvedValue({ data: {}, error: null });
      const res = await service.resetPassword(dto, userId);
      expect(res).toEqual({ message: 'Passord changed successfully' });
    });
  });
});

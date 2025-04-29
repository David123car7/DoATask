import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

// Minimal PrismaService mock (unused here)
const mockPrismaService = {} as unknown as PrismaService;

// Mock Express file
const createMockFile = (name: string) => ({
  originalname: name,
  buffer: Buffer.from(''),
  mimetype: 'image/png',
} as Express.Multer.File);

describe('StorageService', () => {
  let service: StorageService;
  let mockSupabaseService: Partial<SupabaseService>;
  let storageClient: any;

  beforeEach(async () => {
    storageClient = {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      list: jest.fn(),
      remove: jest.fn(),
      createBucket: jest.fn(),
    };
    mockSupabaseService = {
      getAdminClient: jest.fn().mockReturnValue({ storage: storageClient }),
      handleSupabaseError: jest.fn() as unknown as (error: any, context: string) => never,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  // === uploadImages ===
  describe('uploadImages', () => {
    const bucket = 'bucket';
    const userId = 'user';
    const folder = 'folder';
    const files = [createMockFile('a.png'), createMockFile('b.png')];

    it('successfully uploads all files', async () => {
      const responses = files.map(f => ({ data: { path: f.originalname }, error: null }));
      storageClient.upload
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1]);

      const result = await service.uploadImages(bucket, userId, folder, files);
      expect(storageClient.from).toHaveBeenCalledWith(bucket);
      expect(storageClient.upload).toHaveBeenCalledTimes(2);
      expect(result).toEqual(responses);
      expect(mockSupabaseService.handleSupabaseError).not.toHaveBeenCalled();
    });

    it('calls handleSupabaseError if any upload errors', async () => {
      const ok = { data: {}, error: null };
      const err = { data: null, error: new Error('fail') };
      storageClient.upload
        .mockResolvedValueOnce(ok)
        .mockResolvedValueOnce(err);

      const result = await service.uploadImages(bucket, userId, folder, files);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(err, 'Upload Image');
      expect(result).toEqual([ok, err]);
    });
  });

  // === uploadImage ===
  describe('uploadImage', () => {
    const bucket = 'bucket';
    const userId = 'user';
    const folder = 'f';
    const file = createMockFile('z.jpg');

    it('uploads single file successfully', async () => {
      storageClient.upload.mockResolvedValue({ data: { path: file.originalname }, error: null });

      await expect(service.uploadImage(bucket, userId, folder, file)).resolves.toBeUndefined();
      expect(storageClient.from).toHaveBeenCalledWith(bucket);
      expect(storageClient.upload).toHaveBeenCalledWith(
        `${userId}/${folder}/${file.originalname}`,
        file.buffer,
        { contentType: file.mimetype },
      );
      expect(mockSupabaseService.handleSupabaseError).not.toHaveBeenCalled();
    });

    it('calls handleSupabaseError on upload error', async () => {
      const error = new Error('upload fail');
      storageClient.upload.mockResolvedValue({ data: null, error });

      await service.uploadImage(bucket, userId, folder, file);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(error, 'Upload Image');
    });
  });

  // === createBucket ===
  describe('createBucket', () => {
    const bucket = 'new-bucket';

    it('creates bucket successfully', async () => {
      const bucketData = { id: 'id1', name: bucket };
      storageClient.createBucket.mockResolvedValue({ data: bucketData, error: null });

      const result = await service.createBucket(bucket);
      expect(storageClient.createBucket).toHaveBeenCalledWith(bucket);
      expect(result).toEqual(bucketData);
      expect(mockSupabaseService.handleSupabaseError).not.toHaveBeenCalled();
    });

    it('handles createBucket error', async () => {
      const err = new Error('bucket fail');
      storageClient.createBucket.mockResolvedValue({ data: null, error: err });

      await service.createBucket(bucket);
      expect(mockSupabaseService.handleSupabaseError).toHaveBeenCalledWith(err, 'Create Bucket');
    });
  });
});

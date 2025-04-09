import { Controller, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import { StorageService } from './storage.service';
import { BUCKETS } from '../lib/constants/storage/buckets';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class StorageController {
  constructor(private readonly appService: StorageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  async uploadImgage(){

  }
}

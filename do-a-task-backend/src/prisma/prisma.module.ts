import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //to make the prisma service available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService] //to be able to use the prisma service in other modules
})
export class PrismaModule {}
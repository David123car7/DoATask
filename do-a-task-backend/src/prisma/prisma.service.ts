import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  handlePrismaError(context: string, error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          // Unique constraint violation
          throw new HttpException(
            `${context}: Duplicate field value violates a unique constraint.`,
            HttpStatus.BAD_REQUEST,
          );
        case 'P2003':
          // Foreign-key constraint failure
          throw new HttpException(
            `${context}: Foreign-key constraint failure.`,
            HttpStatus.BAD_REQUEST,
          );
        default:
          throw new HttpException(
            `${context}: Unexpected Prisma error with code ${error.code}.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    // Non-Prisma or unknown errors
    throw new HttpException(
      `${context}: An unexpected error occurred.`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async cleanDatabase(): Promise<void> {
    await this.$transaction([
      // child records first
      this.memberTask.deleteMany(), //
      this.purchase.deleteMany(),
      this.item.deleteMany(),
      this.store.deleteMany(),
      this.task.deleteMany(),
      this.notification.deleteMany(),
      this.pointsMember.deleteMany(), 
      this.member.deleteMany(),
      this.address.deleteMany(),
      this.userCommunity.deleteMany(),
      this.user.deleteMany(),
      this.community.deleteMany(),
      this.locality.deleteMany(),
      this.contact.deleteMany(),
      this.image.deleteMany(),
      
    ]);
  }
}

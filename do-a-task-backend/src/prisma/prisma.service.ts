import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { HttpException, HttpStatus} from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService)
    {
        super({
                datasources: {
                    db: {
                        url: config.get("DATABASE_URL"),
                    },
                },
        });
    }

    //https://www.prisma.io/docs/orm/reference/error-reference
    handlePrismaError(context: string, error: unknown): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          switch (error.code) {
            case 'P2002':
              // Unique constraint violation.
              throw new HttpException(
                `${context}: Duplicate field value violates a unique constraint.`,
                HttpStatus.BAD_REQUEST
              );
              case 'P2003 ':
                // Unique constraint violation.
                throw new HttpException(
                  `${context}: Foreign‐key constraint failure:`,
                  HttpStatus.BAD_REQUEST
                );
            default:
              throw new HttpException(
                `${context}: Unexpected Prisma error with code ${error.code}.`,
                HttpStatus.INTERNAL_SERVER_ERROR
              );
          }
        }
        // For non-Prisma errors, throw a generic internal server error.
        throw new HttpException(`${context}: An unexpected error occurred.`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
}
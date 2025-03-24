import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";


@Injectable({})
export class UserService{
    constructor(private prisma: PrismaService){}

    async GetUserData(){

    }

    async getUserById(userId: string) {
        const idConv = parseInt(userId, 10);

        return this.prisma.member.findUnique({
          where: { id: idConv},
          select: {
            user:{
                select:{
                    name: true,
                    email: true,
                    birthDate: true,
                    contact:{
                      select:{
                        number: true,
                      }
                    }
                }
            },
          }
        });
    }
}
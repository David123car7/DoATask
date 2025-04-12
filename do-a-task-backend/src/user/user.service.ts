import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {ChangeUserDataDto} from './dto/user.dto'

@Injectable()
export class UserService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async getUserData(userEmail : string){
        try{
            const user = await this.prisma.user.findUnique({
                where: {
                    email: userEmail
                }
            })

            const contact = await this.prisma.contact.findUnique({
                where:{
                    id: user.contactId
                }
            })
            return {user: user, contact: contact}
        }
        catch(error) {
            this.prisma.handlePrismaError("GetUserData", error)
        }
    }

    async changeUserData(dto: ChangeUserDataDto, userId: string){
        try{
            const data = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data:{
                    name: dto.name,
                    birthDate:dto.birthDate,
                    contact:{
                        update:{
                            number: dto.number
                        }
                    }
                }
            })

            return data
        }
        catch(error) {
            this.prisma.handlePrismaError("GetUserData", error)
        }

    }

    async getUserCoins(userId: string){
        try{
            const findUser = await this.prisma.user.findUnique({
                where:{
                    id:userId,
                },
                select:{
                    totalCoins:true,
                }
            })
            return findUser?.totalCoins ?? null
        }
        catch(error){
            this.prisma.handlePrismaError("GetUserData", error)
            return null;
        }
    }
}

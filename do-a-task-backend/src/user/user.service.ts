import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
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
            return {
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  birthDate: user.birthDate,
                },
                contact: {
                  number: contact.number,
                }
              }
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
                    Contact:{
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
}

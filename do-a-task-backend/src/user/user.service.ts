import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import {ChangeUserDataDto} from './dto/user.dto'

@Injectable()
export class UserService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async getUserData(userId : string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if(!user){
            throw new HttpException("The user does not exist", HttpStatus.BAD_REQUEST)
        }

        const contact = await this.prisma.contact.findUnique({
            where:{
                id: user.contactId
            }
        })
        if(!contact){
            throw new HttpException("The user does not have a contact", HttpStatus.BAD_REQUEST)
        }

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

    async changeUserData(dto: ChangeUserDataDto, userId: string){
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if(!user){
            throw new HttpException("The user does not exist", HttpStatus.BAD_REQUEST)
        }

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
        }
        catch(error) {
            this.prisma.handlePrismaError("GetUserData", error)
        }
    }
}

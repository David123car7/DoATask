import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseService } from "src/supabase/supabase.service";
import { AssignTaskDto, CreateTasksDto } from "./dto/tasks.dto";
import { baseReward } from "src/lib/constants/tasks/tasks.constants";
import { EvaluateTaskDto } from "./dto/tasks.dto";
import { find } from "rxjs";

@Injectable({})
export class TasksService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createTask(dto: CreateTasksDto, userId: string) {
        const reward = baseReward[dto.difficulty]
        try{
            const community = await this.prisma.community.findFirst({
                where:{
                    communityName: dto.communityName
                }
            })
            if(!community){
                throw new HttpException("Community with this name does not exist", HttpStatus.BAD_REQUEST)
            }    

            const member = await this.prisma.member.findFirst({
                where:{
                    userId: userId,
                    communityId: community.id
                }
            })
            if(!member){
                throw new HttpException("The user is not a member of the community", HttpStatus.BAD_REQUEST)
            }   

            const result = await this.prisma.$transaction(async () => {
                const task = await this.prisma.task.create({
                    data: {
                        title: dto.tittle,
                        description: dto.description,
                        difficulty: parseInt(dto.difficulty),
                        location: dto.location,
                        coins: reward.coins,
                        points: reward.points,
                        creatorId: member.id,
                    },
                });

                await this.prisma.memberTask.create({
                    data: {
                        status: "Por Aceitar",
                        taskId: task.id,
                    },
                });
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Creating Task" ,error)
        }
    }

    async assignTask(userId: string, dto: AssignTaskDto){
        try{
            console.log(dto.communityId)
            console.log(dto.taskId)
            const member = await this.prisma.member.findFirst({
                where:{
                    userId: userId,
                    communityId: dto.communityId
                }
            })
            if(!member){
                throw new HttpException("The user is not a member of the community", HttpStatus.BAD_REQUEST)
            }

            const memberTask = await this.prisma.memberTask.findFirst({
                where:{
                    taskId: dto.taskId
                }
            })

            await this.prisma.memberTask.update({
                where:{
                    id: memberTask.id
                },
                data:{
                    status: "Em Progresso",
                    assignedAt: new Date(),
                    volunteerId: member.id,
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Assign Task" ,error)
        }
    }



    async endingTaskVolunteer(/*, memberTaskId: number*/){
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                const memberTask = await this.prisma.memberTask.update({
                    where: {
                        id: 7,     
                    },
                    data: {
                        status: 'completed',
                        completedAt: new Date(), // Marking the task as completed
                    },
                    include: {
                        task: {
                            include: {
                                creator: {
                                    include: {
                                        user: {
                                            select: {
                                                email: true,
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            
                await this.prisma.notification.create({
                    data:{
                        title: 'Tarefa Concluída - Avaliação Necessária',
                        message: `Olá, a tarefa ${memberTask.task.title} que você criou foi concluída por um voluntário. Por favor, avalie o desempenho do voluntário.`,
                        recipientId: memberTask.task.creator.user.id,
                    }
                });
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Ending Task Volunteer" , error);
        }

        return {message: 'Task updated successfully'};
    }

    async evaluateTask(/*memberTaskId: number,*/ dto:EvaluateTaskDto) {
        let memberTask
        try{
            memberTask = await this.prisma.memberTask.findUnique({
                where: {
                    id: 7,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Evaluate Task (Find MemberTask)" , error);
        }

        let updatedMemberTask
        try{
            updatedMemberTask = await this.prisma.memberTask.update({
                where: {
                    id: 7,
                },
                data: {
                    score: dto.score,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Evaluate Task (Update MemberTask)" , error);
        }

        return {message: 'Task evaluated successfully'};
    }



    async assignBonus(volunteerId: number, evaluation: number, memberTaskId: number) {
        
        let volunteerTask
        try{
            volunteerTask = await this.prisma.memberTask.findUnique({
                where: {
                    id: 7,
                },
                include: {
                    task: true,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Assign Bonus (Find Volunteer Task)" , error);
        }

        const reward = baseReward[volunteerTask.task.difficulty];
        const { totalCoins, totalPoints } = this.calculateReward(volunteerTask.task.difficulty, 5);
        
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                let pointsMember = await this.prisma.pointsMember.findFirst({
                    where: {
                        memberId: 6,
                    },
                });

                const updatedCoins = await this.prisma.member.update({
                    where: {
                        id: 6,
                    },
                    data: {
                        user: {
                            update: {
                                totalCoins: {
                                    increment: totalCoins,
                                },
                            },
                        },
                    },
                });

                if (!pointsMember) {
                    pointsMember = await this.prisma.pointsMember.create({
                        data: {
                            memberId: 6,
                            points: totalPoints,
                        },
                    });
                } else {
                    // Se houver, atualiza os pontos
                    pointsMember = await this.prisma.pointsMember.update({
                        where: {
                            id: pointsMember.id,
                        },
                        data: {
                            points: {
                                increment: totalPoints,
                            },
                        },
                    });
                }
            
                // Criação da notificação
                await this.prisma.notification.create({
                    data: {
                        title: 'Avaliação Concluída',
                        message: `Você recebeu ${evaluation}/5 na tarefa. Bônus: ${totalCoins} moedas e ${totalPoints} pontos`,  // Correção aqui, usando crase
                        recipientId: "7", 
                    },
                });
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Assign Bonus" , error);
        }
    
        return { success: true, bonus: { totalCoins, totalPoints }, evaluation };
    }
    


    private  calculateReward(difficulty: string, score: number){    
        const diff = difficulty.toLowerCase();
        const reward = baseReward[diff] || {coins: 5, points:10}; // Default reward if difficulty is not recognized (Default reward tem que ser guardada nas constans)
    
        const performanceFactor = (score -1) /4;
        const bonusMultiplier = 0.2; // 20% bonus for performance
    
        const bonusCoins = performanceFactor * bonusMultiplier * reward.coins;
        const bonusPoints = performanceFactor * bonusMultiplier * reward.points;
    
        return {
            totalCoins : reward.coins + bonusCoins,
            totalPoints : reward.points + bonusPoints,
        };
    }

    async getTaskByCommunity(userId: string, communityName: string){
        try{   

            const community = await this.prisma.community.findFirst({
                where:{
                    communityName: communityName,
                }
            });

            const findMember = await this.prisma.member.findFirst({
                where:{
                    communityId : community.id,
                    userId : userId
                },
            });

            const findTasks = await this.prisma.task.findMany({
                where:{
                    creatorId : findMember.id
                },
                include:{
                    members:{
                        select:{
                            volunteerId: true,
                            completedAt: true,
                            status: true,
                        }
                    }
                }
            });
            console.log(findTasks)
            return findTasks;
        }
        catch(error){
            console.error('Error getting done tasks in community:', error); 
        }
    }

      async GetTasksMemberDoing(userId: string, communityName:string){
        try{
            const community = await this.prisma.community.findFirst({
                where:{
                    communityName: communityName,
                }
            });
            if(!community){
                throw new HttpException("Community does not exist with this name", HttpStatus.BAD_REQUEST)
            }
    
            const findMember = await this.prisma.member.findFirst({
                where:{
                    communityId : community.id,
                    userId : userId
                },
            });
            if(!findMember){
                throw new HttpException("The user does not belong to the community", HttpStatus.BAD_REQUEST)
            }
            
            const memberTasks = await this.prisma.memberTask.findMany({
                where:{
                    volunteerId : findMember.id
                },
            });
            if(!memberTasks)
            {
                throw new HttpException("The member accepted no tasks", HttpStatus.BAD_REQUEST)
            }

            const tasks = await this.prisma.task.findMany({
                where: {
                    id: { in: memberTasks.map(m => m.taskId) }
                }
            })
            
            console.log("Tasks", tasks)
            console.log("MemberTasks", memberTasks)
            return {tasks: tasks, memberTasks: memberTasks};
        }
        catch(error){
            this.prisma.handlePrismaError("Gettting volunteer tasks:", error)
        }

    }
    catch(error){
        console.error('Error getting done tasks in community:', error); 
    }
}
       

/*
const findTasks = await this.prisma.memberTask.findMany({
                where:{
                    volunteerId : findMember.id
                },
                include:{
                    task:{
                        select:{
                            creatorId: true,
                            title: true,
                            coins: true,
                            points:true,
                            location: true
                        }
                    }
                },
            });
*/
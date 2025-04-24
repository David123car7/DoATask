import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SupabaseService } from "../supabase/supabase.service";
import { AssignTaskDto, CreateTasksDto } from "./dto/tasks.dto";
import { baseReward } from "../lib/constants/tasks/tasks.constants";
import { TASK_STATES } from "../lib/constants/tasks/tasks.constants";
import { BUCKETS } from "../lib/constants/storage/buckets";

@Injectable({})
export class TasksService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createTask(dto: CreateTasksDto, userId: string, imageName: string) {
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
                const image = await this.prisma.image.create({
                    data:{
                        imagePath: `${userId}/${dto.tittle}/${imageName}`
                    }
                })

                const task = await this.prisma.task.create({
                    data: {
                        title: dto.tittle,
                        description: dto.description,
                        difficulty: parseInt(dto.difficulty),
                        location: dto.location,
                        coins: reward.coins,
                        points: reward.points,
                        creatorId: member.id,
                        imageId: image.id,
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

    async assignTask(userId: string, taskId: number){
        
            const task = await this.prisma.task.findFirst({
                where:{
                    id: taskId
                }
            })
            if(!task){
                throw new HttpException("The task does not exist", HttpStatus.BAD_REQUEST)
            }

            const member = await this.prisma.member.findFirst({
                where:{
                    id: task.creatorId,
                }
            })
            if(!member){
                throw new HttpException("The task has no creator", HttpStatus.BAD_REQUEST)
            }

            const community = await this.prisma.community.findFirst({
                where:{
                    id: member.communityId
                }
            })
            if(!community){
                throw new HttpException("The task is not assigned to any community", HttpStatus.BAD_REQUEST)
            }

            const memberUser = await this.prisma.member.findFirst({
                where:{
                    userId: userId,
                    communityId: community.id,
                }
            })
            if(!memberUser){
                throw new HttpException("The user is not a member of the community", HttpStatus.BAD_REQUEST)
            }

            const verify = await this.verifyAssignTask(userId, member.id)
            if(verify == false)
                throw new HttpException("The user has allready accepted one task in this community", HttpStatus.BAD_REQUEST)

            const memberTask = await this.prisma.memberTask.findFirst({
                where:{
                    taskId: taskId
                }
            })

            try{
                await this.prisma.memberTask.update({
                    where:{
                        id: memberTask.id
                    },
                    data:{
                        status: TASK_STATES.ACCEPTED,
                        assignedAt: new Date(),
                        volunteerId: memberUser.id,
                    }
                })
            }
            catch(error){
                this.prisma.handlePrismaError("Assign Task" ,error)
            }
    }

    async finishTask(memberTaskId: number){
        if(!memberTaskId)
            throw new HttpException("The memberTaskId is invalid", HttpStatus.BAD_REQUEST)

        try{
            const memberTask = await this.prisma.memberTask.findFirst({
                where: {
                    id: memberTaskId
                }
            })
            if(!memberTask){
                throw new HttpException("The memberTask does not exist", HttpStatus.BAD_REQUEST)
            }

            await this.prisma.memberTask.update({
                where: {
                    id: memberTask.id
                },
                data: {
                    status: TASK_STATES.FINISH,
                    completedAt: new Date(), 
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Finish Task" , error);
        }
    }

    async evaluateTask(memberTaskId: number, score: number) {
        if(!memberTaskId)
            throw new HttpException("Invalid membertaskid", HttpStatus.BAD_REQUEST)

        try{
            const memberTask = await this.prisma.memberTask.update({
                where:{
                    id: memberTaskId
                },
                data:{
                    score: score,
                    status: TASK_STATES.EVALUATED,
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Evaluating task", error)
        }
    }

    async assignBonus(memberTaskId: number, score: number, ) {
        const memberTask = await this.prisma.memberTask.findUnique({
                where: {
                    id: memberTaskId,
                },
                include: {
                    Task: true,
                },
            });
        if(!memberTask){
            throw new HttpException("No memberTask found with the id", HttpStatus.BAD_REQUEST)
        }

        const member = await this.prisma.member.findFirst({
            where:{
                id: memberTask.volunteerId
            }
        })
        if(!member){
            throw new HttpException("There is not member assigned to the task", HttpStatus.BAD_REQUEST)
        }

        const { totalCoins, totalPoints } = this.calculateReward(memberTask.Task.difficulty, score)

        const pointsMember = await this.prisma.pointsMember.findFirst({
            where: {
                memberId: member.id,
            },
        });
        if(!pointsMember){
            throw new HttpException("No pointsMember assigned to member", HttpStatus.BAD_REQUEST)
        }

        try{
            const result = await this.prisma.$transaction(async () => {
                await this.prisma.member.update({
                    where: {
                        id: member.id,
                    },
                    data: {
                        coins: { increment: totalCoins },
                    }
                });
    
                await this.prisma.pointsMember.update({
                    where: {
                        id: pointsMember.id,
                    },
                    data: {
                        points: {
                            increment: totalPoints,
                            },
                        },
                });
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Assigning bonus", error)
        }
    }
    

    private  calculateReward(difficulty: number, score: number){    
        const reward = baseReward[difficulty] || {coins: 5, points:10}; // Default reward if difficulty is not recognized (Default reward tem que ser guardada nas constans)
    
        const performanceFactor = (score -1) /4;
        const bonusMultiplier = 0.2; // 20% bonus for performance
    
        const bonusCoins = performanceFactor * bonusMultiplier * reward.coins;
        const bonusPoints = performanceFactor * bonusMultiplier * reward.points;
    
        return {
            totalCoins : reward.coins + bonusCoins,
            totalPoints : reward.points + bonusPoints,
        };
    }

      async GetTasksMemberDoing(userId: string){
        
            const findMember = await this.prisma.member.findMany({
                where:{
                    userId : userId
                },
            });
            if(!findMember){
                throw new HttpException("The user does not belong to any community", HttpStatus.BAD_REQUEST)
            }

            const community = await this.prisma.community.findMany({
                where:{
                    id: {in: findMember.map(m => m.communityId)},
                },
                select:{
                    communityName: true
                }
            })
            if(!community){
                throw new HttpException("The member is not assigned to any community", HttpStatus.BAD_REQUEST)
            }
            
            const memberTasks = await this.prisma.memberTask.findMany({
                where:{
                    volunteerId : {in: findMember.map(m => m.id)},
                    completedAt: null,
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
            if(!tasks){
                throw new HttpException("The member is not assigned to member tasks", HttpStatus.BAD_REQUEST)
            }
            
            return {tasks: tasks, memberTasks: memberTasks, community: community};
    }
    catch(error){
        console.error('Error getting done tasks in community:', error); 
    }

    async GetTasksMemberCreated(userId: string){
        const member = await this.prisma.member.findMany({
            where:{
                userId : userId
            },
        });
        if(!member){
            throw new HttpException("The user does not belong to the any community", HttpStatus.BAD_REQUEST)
        }

        const community = await this.prisma.community.findMany({
            where:{
                id: {in: member.map(m => m.communityId)}
            },
            select:{communityName: true}
        })
        if(!community){
            throw new HttpException("The member is not associated to the any community", HttpStatus.BAD_REQUEST)
        }
            
        const tasks = await this.prisma.task.findMany({
            where:{
                creatorId: { in: member.map(m => m.id) }
            }
        })
        if(!tasks){
            throw new HttpException("The user has not created any tasks", HttpStatus.BAD_REQUEST)
        }

        const memberTasks = await this.prisma.memberTask.findMany({
            where:{
                taskId: {in: tasks.map(t => t.id)},
                score: null,
            }
        })
        if(!memberTasks){
            throw new HttpException("There are memberTasks assigned to the tasks", HttpStatus.BAD_REQUEST)
        }

        const tasksFiltered = await this.prisma.task.findMany({
            where:{
                id: { in: memberTasks.map(m => m.taskId) }
            }
        })
        if(!tasksFiltered){
            throw new HttpException("There are not any task to be evaluated", HttpStatus.BAD_REQUEST)
        }

        if(memberTasks.length == 0){
            throw new HttpException("There are not any task to evaluate", HttpStatus.BAD_REQUEST)
        }
            
        return {tasks: tasksFiltered, memberTasks: memberTasks, community: community};
    }

    
    async getTaskBeDoneCommunity(communityName: string){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName : communityName,
            },
        });
        if(!community){
            throw new HttpException("The community does not exist", HttpStatus.BAD_REQUEST)
        }
    
        const member = await this.prisma.member.findMany({
            where:{
                communityId: community.id
            },
            select:{
                id:true,
            },
        });
        if(!member){
            throw new HttpException("Error finding members", HttpStatus.BAD_REQUEST)
        }

        if(member.length == 0){
            throw new HttpException("The community does not have any members", HttpStatus.BAD_REQUEST)
        }
    
            
        const task = await this.prisma.task.findMany({
            where:{
                creatorId: {in: member.map(m => m.id)}
            },
        });
    
        const memberTask = await this.prisma.memberTask.findMany({
            where:{
                taskId : {in: task.map(t => t.id)},
                assignedAt : null
            },
        });

        const taskFilter = await this.prisma.task.findMany({
            where:{
                id: {in: memberTask.map(m => m.taskId)}
            },
        });

        
        const images = await this.prisma.image.findMany({
            where:{
                id: { in: taskFilter.map(t => t.imageId) }
            },
        })

        const imageMap = images.reduce<Record<number, string>>((map, rec) => {
            map[rec.id] = rec.imagePath;
            return map;
        }, {});
      
        const storage = this.supabaseService.getAdminClient().storage.from(BUCKETS.TASK_IMAGES)
        if(!storage){
            throw new HttpException("The bucket storage does not exist", HttpStatus.BAD_REQUEST)
        }

        const tasksWithImages = await Promise.all (taskFilter.map(async (task) => {
            const path = task.imageId != null ? imageMap[task.imageId] : null;

            const {data, error} = await storage.createSignedUrl(path, 3600)
            console.log(data)
            if (error) {
              return { ...task, imageUrl: null };
            }
            return { ...task, imageUrl: data };
        }));

        return {tasks: tasksWithImages, memberTasks: memberTask}
    }

    async verifyAssignTask(userId: string, memberId: number){
        try{
            const memberTasks = await this.prisma.memberTask.findMany({
                where:{
                    volunteerId: memberId,
                    completedAt: null
                }
            })
            
            if(memberTasks.length == 0)
                return true
            else
                return false
        }
        catch(error){
            this.prisma.handlePrismaError("Verify Assign Task", error)
        }
    }

    async DeleteTask(taskId: number){
        const task = await this.prisma.task.findUnique({
            where:{
                id: taskId
            }
        })
        if(!task){
            throw new HttpException("There is not a task with this id", HttpStatus.BAD_REQUEST)
        }

        const memberTask = await this.prisma.memberTask.findFirst({
            where:{
                taskId: task.id,
                completedAt: null
            }
        })
        if(!memberTask){
            throw new HttpException("The task is allready completed", HttpStatus.BAD_REQUEST)
        }

        try{
            const result = await this.prisma.$transaction(async () => {
                await this.prisma.memberTask.delete({
                    where:{
                        id: memberTask.id
                    }
                })
                await this.prisma.task.delete({
                    where:{
                        id: taskId
                    }
                })
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Delete Task", error)
        }
    }

    async CancelTask(taskId: number){
        const task = await this.prisma.task.findUnique({
            where:{
                id: taskId
            }
        })
        if(!task){
            throw new HttpException("There is not a task with this id", HttpStatus.BAD_REQUEST)
        }

        const memberTask = await this.prisma.memberTask.findFirst({
            where:{
                taskId: task.id,
                completedAt: null
            }
        })
        if(!memberTask){
            throw new HttpException("The task is allready completed", HttpStatus.BAD_REQUEST)
        }

        try{
            const result = await this.prisma.$transaction(async () => {
                await this.prisma.memberTask.update({
                    where: {
                        id: memberTask.id,
                    },
                    data:{
                        assignedAt: null,
                        volunteerId: null,
                        status: TASK_STATES.NOT_ACCEPTED,
                    }
                })
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Cancel Task", error)
        }
    }
}
       


    
       

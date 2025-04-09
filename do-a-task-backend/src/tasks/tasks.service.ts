import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseService } from "src/supabase/supabase.service";
import { CreateTasksDto } from "./dto/tasks.dto";
import { baseReward } from "src/lib/constants/tasks/tasks.constants";
import { EvaluateTaskDto } from "./dto/tasks.dto";
import { HttpException, HttpStatus } from "@nestjs/common";


@Injectable({})
export class TasksService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createTask(dto: CreateTasksDto) {
        if (!['easy', 'medium', 'hard'].includes(dto.difficulty)) {
            throw new HttpException("Dificuldade inválida", HttpStatus.BAD_REQUEST)
        }
<<<<<<< Updated upstream
        
        const reward = baseReward[dto.difficulty]
        
        let task
        try{
            task = await this.prisma.task.create({
                data: {
                    title: dto.title,
                    difficulty: dto.difficulty,
                    coins: reward.coins,
                    points: reward.points,
                    creatorId: 1,  // Usar o id do usuário autenticado
                },
                include: {
                    creator: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    contact: true,
                                },
=======

        const reward = baseReward[dto.difficulty];
    
        if (!reward) {
            throw new Error('Não foi possível calcular as recompensas. Verifique a dificuldade.');
        }
        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        const userId = parseInt(user.user.id)

        const task = await this.prisma.task.create({
            data: {
                title: dto.title,
                difficulty: dto.difficulty,
                coins: reward.coins,
                points: reward.points,
                creatorId: userId,  // Usar o id do usuário autenticado
            },
            include: {
                creator: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                contact: true,
>>>>>>> Stashed changes
                            },
                            address: true, // Incluir o endereço do criador
                            
                        },
                    },
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Creating Task" ,error)
        }
    
        return { message: "Created task with sucess", taskData: task}
    }

<<<<<<< Updated upstream
    //  FAlTA  TESTAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async createMemberTask(/*, taskId: number*/ ){ 
=======
//  FAlTA  TESTAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async createMemberTask( taskId: number ){
>>>>>>> Stashed changes
        
        //const user = (await this.supabaseService.supabase.auth.getUser()).data;////troca por getTask
        //const id = parseInt(user.user.id); // <------ É o Id do USER OK!!!!!
        //const idTask = taskId;// <--- É o Id da TASK OK!!!!!
<<<<<<< Updated upstream
        let task
        try{
            task = await this.prisma.memberTask.create({
                data: {
                    status: 'pending',
                    assignedAt: new Date(),
                    completedAt: new Date(1900,1,1,12,12,12,12),
                    score: 0,
                    volunteerId: 6,
                    taskId: 27,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Creating MemberTask", error)
        }

        return { message: "Created member task with sucess", memberTaskData: task}
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
=======

        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        const userId = parseInt(user.user.id);

        if(!userId){
            throw new Error("Utilizador nao encontrado")
        }
        const task = await this.prisma.memberTask.create({
            data: {
                status: 'pending',
                assignedAt: new Date(),
                completedAt: new Date(1900,1,1,12,12,12,12),
                score: 0,
                volunteerId: userId,
                taskId: taskId,
            },
        });
        return task;
    }

    async endingTaskVolunteer(memberTaskId: number){
        
        const memberTask = await this.prisma.memberTask.update({
            where: {
                id: memberTaskId,     
            },
            data: {
                status: 'completed',
                completedAt: new Date(), // Marking the task as completed
            },
            include: {
                task: {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======


    async evaluateTask(memberTaskId: number, dto:EvaluateTaskDto) {

        const memberTask = await this.prisma.memberTask.findUnique({
            where: {
                id: memberTaskId,
            },
        });

        if (!memberTask) {
            throw new Error('Member task not found.');
        }

        const updatedMemberTask = await this.prisma.memberTask.update({
            where: {
                id: memberTaskId,
            },
            data: {
                score: dto.score,
            },
        });
        return updatedMemberTask;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
                        recipientId: 7,
=======
        const volunteerTask = await this.prisma.memberTask.findUnique({
            where: {
                id: memberTaskId,
            },
            include: {
                task: true,
            },
        });
    
        if (!volunteerTask) {
            throw new Error('Volunteer task not found.');
        }
    
        const reward = baseReward[volunteerTask.task.difficulty];
    
        if (!reward) {
            throw new Error('Não foi possível calcular as recompensas. Verifique a dificuldade.');
        }
    
        const { totalCoins, totalPoints } = calculateReward(volunteerTask.task.difficulty, 5);
    
        // Atualiza as moedas do voluntário
        const updatedCoins = await this.prisma.member.update({
            where: {
                id: volunteerId,
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
    
        let pointsMember = await this.prisma.pointsMember.findFirst({
            where: {
                memberId: volunteerId,
            },
        });
    
        // Se não houver registro de pontos, cria um novo
        if (!pointsMember) {
            pointsMember = await this.prisma.pointsMember.create({
                data: {
                    memberId: volunteerId,
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
>>>>>>> Stashed changes
                    },
                });
            });
        }
<<<<<<< Updated upstream
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
/*


    //  FAlTA  TESTAR  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //  Volunteer is responsible for ending the task
    async endingTaskVolunteer(dto : EndingTasksDto/*, memberTaskId: number){
        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        const task = await this.prisma.memberTask.update({
            where: {
                id: 6,     
            },
            data: {
                status: 'completed',
                completedAt: new Date(), // Marking the task as completed
            },
        });
        
        const taskDetails = await this.prisma.task.findUnique({
            where: {
                id: 26,
            },
            select: {
                id: true,
                creatorId: true,
            },
        });
        
        if (!taskDetails) {
            throw new Error('Task not found.');
        }

        const {creatorId} = taskDetails;

        const creatormember = await this.prisma.member.findUnique({
            where:{
                id: 1,
            },
            include:{
                user:{
                    select:{
                        email: true,
                    }
                }
            }
        });

        if (!creatormember) {
            throw new Error('Creator not found.');
        }
        
        const msg ={
            to: creatormember.user.email, // Email do criador da tarefa
            from: 'marquesdiogoalex@gmail.com',//falta colocar o email do remetente
            subject: 'Tarefa Concluída - Avaliação Necessária',
            text: 'Olá ${creatormember.user.nome},\n\nA tarefa ${memberTask.task.title} que você criou foi concluída por um voluntário. Por favor, avalie o desempenho do voluntário.\n\nObrigado!',
        };

        try {
            await sgMail.send(msg);
            console.log('Email enviado com sucesso para ${creatormember.user.email}');
        } catch (error) {
            console.error('Erro ao enviar o email:', error);
        }
        return task;
    }*/
}

=======
    
        // Criação da notificação
        await this.prisma.notification.create({
            data: {
                title: 'Avaliação Concluída',
                message: `Você recebeu ${evaluation}/5 na tarefa. Bônus: ${totalCoins} moedas e ${totalPoints} pontos`,  // Correção aqui, usando crase
                recipientId: volunteerId,
            },
        });
    
        return { success: true, bonus: { totalCoins, totalPoints }, evaluation };
    }
}
>>>>>>> Stashed changes

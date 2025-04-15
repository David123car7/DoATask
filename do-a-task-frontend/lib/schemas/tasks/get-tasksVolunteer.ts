import { z } from 'zod';

// Schema para os membros da tarefa
const memberSchema = z.object({
  volunteerId: z.number(),  // Identificador do voluntário
  completedAt: z.union([   // Permite tanto uma string quanto um objeto Date
    z.string().transform((str) => new Date(str)), 
    z.date()
  ]).nullable(), // A data de conclusão pode ser nula
  status: z.string(),  // Status do voluntário
});

// Schema para a tarefa em si
export const taskVolunteerSchema = z.object({
  id: z.number(),  // ID da tarefa
  title: z.string(),  // Título da tarefa
  difficulty: z.number().nullable(),  // Nível de dificuldade, pode ser nulo
  creatorId: z.number(),  // ID do criador
  coins: z.number().nullable(),  // Número de moedas associadas, pode ser nulo
  points: z.number().nullable(),  // Número de pontos associados, pode ser nulo
  location: z.string(),  // Localização da tarefa
  description: z.string().optional(),  // Descrição opcional
  createdAt: z.date().optional(),  // Data de criação opcional
  updatedAt: z.date().optional(),  // Data de atualização opcional
  members: z.array(memberSchema),  // Lista de membros associados à tarefa
});

// Definir o esquema para um conjunto de tarefas
export const taskVolunteerDataSchema = z.array(taskVolunteerSchema);

// Inferir o tipo dos dados das tarefas
export type TasksVolunteerDataSchema = z.infer<typeof taskVolunteerDataSchema>;

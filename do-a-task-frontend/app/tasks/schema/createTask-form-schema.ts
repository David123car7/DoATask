
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().nonempty("Title is required"),
    difficulty: z.string().nonempty("Difficulty is required"),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Task title cannot be empty")
    .max(100, "Task title must be under 100 characters")
    .trim(),
});

// Extract the TypeScript type directly from the Zod schema
export type TodoInput = z.infer<typeof todoSchema>;
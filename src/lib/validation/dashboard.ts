import { z } from "zod";

export const createSubtaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  taskId: z.string().cuid(),
  isCompleted: z.boolean(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  description: z.string(),
  columnId: z.string().cuid(),
  subtasks: createSubtaskSchema.array(),
});

export const createColumnSchema = z.object({
  name: z.string().min(3, { message: "Must be at least 3 characters long" }),
  boardId: z.string().cuid(),
});

export const createBoardSchema = z.object({
  name: z.string().min(3, { message: "Must be at least 3 characters long" }),
  columns: createColumnSchema.array(),
});

export type ICreateBoard = z.infer<typeof createBoardSchema>;
export type ICreateColumn = z.infer<typeof createColumnSchema>;
export type ICreateTask = z.infer<typeof createTaskSchema>;
export type ICreateSubtask = z.infer<typeof createSubtaskSchema>;

import { z } from "zod";

import { createSubtaskSchema, updateSubtaskSchema } from "./subtask";

export const createTaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  description: z.string().nullable(),
  columnId: z.string().cuid(),
  subtasks: z.array(createSubtaskSchema),
  position: z.number(),
});

export const updateTaskSchema = createTaskSchema
  .extend({
    subtasks: z.array(updateSubtaskSchema),
  })
  .omit({ columnId: true, position: true });

export type ICreateTask = z.infer<typeof createTaskSchema>;
export type IUpdateTask = z.infer<typeof updateTaskSchema>;

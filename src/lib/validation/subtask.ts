import { z } from "zod";

export const createSubtaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  isCompleted: z.boolean(),
});

export const toggleSubtaskSchema = z.object({
  taskId: z.string().cuid(),
  subtasks: z.array(z.string().cuid()),
});

export const updateSubtaskSchema = createSubtaskSchema.extend({
  id: z.string(),
});

export type ICreateSubtask = z.infer<typeof createSubtaskSchema>;
export type IToggleSubtask = z.infer<typeof toggleSubtaskSchema>;
export type IUpdateSubtask = z.infer<typeof updateSubtaskSchema>;

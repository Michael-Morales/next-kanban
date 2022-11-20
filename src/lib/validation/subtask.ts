import { z } from "zod";

export const createSubtaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  isCompleted: z.boolean(),
});

export const toggleSubtaskSchema = z.object({
  subtasks: z.array(z.string().cuid()),
});

export type ICreateSubtask = z.infer<typeof createSubtaskSchema>;
export type IToggleSubtask = z.infer<typeof toggleSubtaskSchema>;

import { z } from "zod";

import { createSubtaskSchema } from "./subtask";

export const createTaskSchema = z.object({
  title: z.string().min(3, { message: "Must be at least 3 characters long" }),
  description: z.string().optional(),
  columnId: z.string().cuid(),
  subtasks: z.array(createSubtaskSchema),
});

export type ICreateTask = z.infer<typeof createTaskSchema>;

import { z } from "zod";

export const createColumnSchema = z.object({
  name: z.string().min(3, { message: "Must be at least 3 characters long" }),
  boardId: z.string().cuid().optional(),
});

export const updateColumnSchema = createColumnSchema.extend({
  id: z.string(),
});

export type ICreateColumn = z.infer<typeof createColumnSchema>;
export type IUpdateColumn = z.infer<typeof updateColumnSchema>;

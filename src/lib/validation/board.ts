import { z } from "zod";

import { createColumnSchema, updateColumnSchema } from "./column";

export const createBoardSchema = z.object({
  name: z.string().min(3, { message: "Must be at least 3 characters long" }),
  columns: z.array(createColumnSchema),
});

export const updateBoardSchema = createBoardSchema.extend({
  columns: z.array(updateColumnSchema),
});

export type ICreateBoard = z.infer<typeof createBoardSchema>;
export type IUpdateBoard = z.infer<typeof updateBoardSchema>;

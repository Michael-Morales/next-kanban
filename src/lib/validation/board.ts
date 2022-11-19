import { z } from "zod";

import { createColumnSchema } from "./column";

export const createBoardSchema = z.object({
  name: z.string().min(3, { message: "Must be at least 3 characters long" }),
  columns: z.array(createColumnSchema),
});

export type ICreateBoard = z.infer<typeof createBoardSchema>;

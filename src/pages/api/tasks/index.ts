import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";
import { createTaskSchema } from "@lib/validation";

export async function createTask(
  title: string,
  columnId: string,
  subtasks: { title: string; isCompleted: boolean }[],
  description: string | null,
  position: number
) {
  return await prisma.task.create({
    data: {
      title,
      columnId,
      description,
      position,
      subtasks: {
        createMany: { data: subtasks },
      },
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { title, columnId, subtasks, description, position } =
          createTaskSchema.parse(req.body);
        await createTask(title, columnId, subtasks, description, position);
        return res.status(201).json({ success: true });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Somethind went wrong." });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";
import { createTaskSchema } from "@lib/validation";

export async function createTask(
  title: string,
  columnId: string,
  subtasks: { title: string; isCompleted: boolean }[],
  description?: string
) {
  return await prisma.task.create({
    data: {
      title,
      columnId,
      description,
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
        const { title, columnId, subtasks, description } =
          createTaskSchema.parse(req.body);
        await createTask(title, columnId, subtasks, description);
        return res.status(201).json({ message: "Task created" });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Somethind went wrong." });
  }
}

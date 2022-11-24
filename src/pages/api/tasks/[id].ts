import type { NextApiRequest, NextApiResponse } from "next";
import type { Subtask } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";

import prisma from "@lib/prismadb";
import { updateTaskSchema } from "@lib/validation";
import { authOptions } from "@api/auth/[...nextauth]";

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
}

export async function updateTask(
  id: string,
  title: string,
  description: string | null,
  subtasks: Omit<Subtask, "taskId" | "createdAt">[]
) {
  await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
    },
  });

  if (!!!subtasks.length) {
    await prisma.subtask.deleteMany({
      where: { taskId: id },
    });
  } else {
    const updatedSubtasks = await Promise.all(
      subtasks.map((subtask) =>
        prisma.subtask.upsert({
          where: { id: subtask.id },
          update: { title: subtask.title },
          create: { title: subtask.title, taskId: id },
        })
      )
    );

    await prisma.subtask.deleteMany({
      where: {
        taskId: id,
        id: { notIn: updatedSubtasks.map(({ id }) => id) },
      },
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  try {
    switch (req.method) {
      case "DELETE":
        await deleteTask(req.query.id as string);
        return res.status(200).json({ success: true });

      case "PATCH":
        const { title, description, subtasks } = updateTaskSchema.parse(
          req.body
        );
        await updateTask(req.query.id as string, title, description, subtasks);
        return res.status(200).json({ success: true });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Somethind went wrong." });
  }
}

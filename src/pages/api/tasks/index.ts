import type { NextApiRequest, NextApiResponse } from "next";
import type { DropResult } from "react-beautiful-dnd";

import prisma from "@lib/prismadb";
import { createTaskSchema } from "@lib/validation";
import { getBoardById } from "@api/boards/[id]";

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

export async function moveTask(
  { draggableId, source, destination }: DropResult,
  boardId: string
) {
  if (destination) {
    if (source.droppableId === destination.droppableId) {
      if (source.index === destination.index) {
        return;
      }

      const tasks = await prisma.task.findMany({
        where: { columnId: destination.droppableId },
        orderBy: { position: "asc" },
      });

      const element = tasks[source.index];
      tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, element);

      await Promise.all(
        tasks.map((task, i) =>
          prisma.task.update({ where: { id: task.id }, data: { position: i } })
        )
      );
    } else {
      // move inside another column
    }
    return await getBoardById(boardId);
  }
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

      case "PATCH":
        const { result, boardId } = req.body;
        const board = await moveTask(result, boardId);
        return res.status(200).json(board);

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: "Somethind went wrong." });
  }
}

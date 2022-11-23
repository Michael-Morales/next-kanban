import type { NextApiRequest, NextApiResponse } from "next";
import type { DropResult } from "react-beautiful-dnd";

import prisma from "@lib/prismadb";
import { createTaskSchema } from "@lib/validation";

export async function getTasksByColumnId(id: string) {
  return await prisma.task.findMany({
    where: { columnId: id },
    orderBy: {
      position: "asc",
    },
    include: {
      subtasks: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          isCompleted: true,
          taskId: true,
        },
      },
    },
  });
}

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

export async function moveTask({
  draggableId,
  source,
  destination,
}: DropResult) {
  if (!destination) {
    return;
  }

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
    const [sourceTasks, destinationTasks] = await Promise.all([
      prisma.task.findMany({
        where: { columnId: source.droppableId },
        orderBy: { position: "asc" },
      }),
      prisma.task.findMany({
        where: { columnId: destination.droppableId },
        orderBy: { position: "asc" },
      }),
    ]);

    sourceTasks.splice(source.index, 1);

    const element = await prisma.task.update({
      where: { id: draggableId },
      data: {
        columnId: destination.droppableId,
      },
    });

    destinationTasks.splice(destination.index, 0, element);

    await Promise.all(
      sourceTasks.map((task, i) =>
        prisma.task.update({ where: { id: task.id }, data: { position: i } })
      )
    );
    await Promise.all(
      destinationTasks.map((task, i) =>
        prisma.task.update({ where: { id: task.id }, data: { position: i } })
      )
    );
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const { id } = req.query;
        const tasks = await getTasksByColumnId(id as string);
        return res.status(200).json(tasks);

      case "POST":
        const { title, columnId, subtasks, description, position } =
          createTaskSchema.parse(req.body);
        await createTask(title, columnId, subtasks, description, position);
        return res.status(201).json({ success: true });

      case "PATCH":
        await moveTask(req.body);
        return res.status(200).json({ success: true });

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

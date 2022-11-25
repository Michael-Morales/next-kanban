import type { NextApiRequest, NextApiResponse } from "next";
import type { Column } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";

import prisma from "@lib/prismadb";
import { updateBoardSchema } from "@lib/validation";
import { authOptions } from "@api/auth/[...nextauth]";

export async function getBoardById(id: string) {
  const res = await prisma.board.findUnique({
    where: { id },
    select: {
      name: true,
      columns: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          boardId: true,
          name: true,
        },
      },
    },
  });

  return res;
}

export async function deleteBoard(id: string) {
  await prisma.board.delete({
    where: {
      id,
    },
  });
}

export async function updateBoard(
  id: string,
  name: string,
  columns: Omit<Column, "boardId" | "createdAt">[]
) {
  await prisma.board.update({
    where: { id },
    data: {
      name,
    },
  });

  if (!!!columns.length) {
    await prisma.column.deleteMany({
      where: { boardId: id },
    });
  } else {
    const updatedColumns = await Promise.all(
      columns.map((column) =>
        prisma.column.upsert({
          where: { id: column.id },
          update: { name: column.name },
          create: { name: column.name, boardId: id },
        })
      )
    );

    await prisma.column.deleteMany({
      where: {
        boardId: id,
        id: { notIn: updatedColumns.map(({ id }) => id) },
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
      case "GET":
        const board = await getBoardById(req.query.id as string);
        return res.status(200).json(board);

      case "DELETE":
        await deleteBoard(req.query.id as string);
        return res.status(200).json({ success: true });

      case "PATCH":
        const { name, columns } = updateBoardSchema.parse(req.body);
        await updateBoard(req.query.id as string, name, columns);
        return res.status(200).json({ success: true });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

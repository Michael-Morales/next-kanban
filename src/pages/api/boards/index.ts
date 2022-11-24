import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import prisma from "@lib/prismadb";
import { createBoardSchema } from "@lib/validation";
import { authOptions } from "@api/auth/[...nextauth]";

export async function getBoards(userId: string) {
  return await prisma.board.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function createBoard(
  name: string,
  columns: { name: string }[],
  userId: string
) {
  return await prisma.board.create({
    data: {
      name,
      columns: {
        createMany: { data: columns },
      },
      userId,
    },
  });
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
    const { userId } = session.user;

    switch (req.method) {
      case "GET":
        const boards = await getBoards(userId);
        return res.status(200).json(boards);

      case "POST":
        const { name, columns } = createBoardSchema.parse(req.body);
        const { id } = await createBoard(name, columns, userId);
        return res.status(201).json({ success: true, boardId: id });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

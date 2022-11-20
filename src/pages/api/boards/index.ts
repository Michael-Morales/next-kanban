import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";
import { createBoardSchema } from "@lib/validation";

export async function getBoards() {
  return await prisma.board.findMany();
}

export async function createBoard(name: string, columns: { name: string }[]) {
  return await prisma.board.create({
    data: {
      name,
      columns: {
        createMany: { data: columns },
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
      case "GET":
        const boards = await getBoards();
        return res.status(200).json(boards);

      case "POST":
        const { name, columns } = createBoardSchema.parse(req.body);
        const { id } = await createBoard(name, columns);
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

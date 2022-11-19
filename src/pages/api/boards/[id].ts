import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";

export async function getBoardById(id: string) {
  const res = await prisma.board.findUnique({
    where: { id },
    include: {
      columns: { include: { tasks: { include: { subtasks: true } } } },
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const board = await getBoardById(req.query.id as string);
        return res.status(200).json(board);

      case "DELETE":
        await deleteBoard(req.query.id as string);
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

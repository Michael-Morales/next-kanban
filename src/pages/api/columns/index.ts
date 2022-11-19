import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";
import { createColumnSchema } from "@lib/validation";

export async function createColumn(name: string, boardId: string) {
  return await prisma.column.create({
    data: {
      name,
      boardId,
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
        const { name, boardId } = createColumnSchema.parse(req.body);
        await createColumn(name, boardId!);
        return res.status(201).json({ message: "Column created" });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Somethind went wrong." });
  }
}

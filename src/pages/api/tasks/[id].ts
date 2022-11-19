import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "DELETE":
        await deleteTask(req.query.id as string);
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

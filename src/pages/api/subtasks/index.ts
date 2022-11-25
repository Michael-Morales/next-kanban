import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import prisma from "@lib/prismadb";
import { toggleSubtaskSchema } from "@lib/validation";
import { authOptions } from "@api/auth/[...nextauth]";

export async function toggleSubtask(taskId: string, ids: string[]) {
  await prisma.subtask.updateMany({
    where: {
      isCompleted: true,
      taskId,
    },
    data: {
      isCompleted: false,
    },
  });

  if (!!ids.length) {
    await Promise.all(
      ids.map((id) =>
        prisma.subtask.update({ where: { id }, data: { isCompleted: true } })
      )
    );
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
      case "PATCH":
        const { taskId, subtasks } = toggleSubtaskSchema.parse(req.body);
        await toggleSubtask(taskId, subtasks);
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

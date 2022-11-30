import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";

async function checkUserEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return !!user;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const { email } = req.query;
        const userExists = await checkUserEmail(email as string);
        return res.status(200).json({ exists: userExists });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

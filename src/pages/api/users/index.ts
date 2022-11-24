import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "argon2";

import prisma from "@lib/prismadb";
import { signupSchema } from "@lib/validation";

async function createUser(email: string, password: string) {
  await prisma.user.create({
    data: { email, password },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        const { email, password } = signupSchema.parse(req.body);
        const hashedPassword = await hash(password);
        await createUser(email, hashedPassword);
        return res.status(201).json({ success: true });

      default:
        return res
          .status(405)
          .json({ message: `HTTP method ${req.method} is not supported.` });
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

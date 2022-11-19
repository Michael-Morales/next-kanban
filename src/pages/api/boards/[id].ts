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

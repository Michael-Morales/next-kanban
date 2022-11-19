import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";
import prisma from "@lib/prismadb";

export default function Board({
  board,
  boards,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout board={board} boards={boards}>
      <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
        {board.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
        <NewColumn />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const boards = await prisma.board.findMany();
  const board = await prisma.board.findUnique({
    where: {
      id: params?.id as string | undefined,
    },
    include: {
      columns: {
        include: {
          tasks: {
            include: {
              subtasks: true,
            },
          },
        },
      },
    },
  });

  if (!board) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      board,
      boards,
    },
  };
}

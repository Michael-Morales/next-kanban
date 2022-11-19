import type { InferGetServerSidePropsType } from "next";

import { Empty } from "@features/dashboard";
import { Layout } from "@features/ui";
import prisma from "@lib/prismadb";

export default function Dashboard({
  boards,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout boards={boards}>
      <Empty
        title="There are no boards. Create a new board to get started."
        buttonLabel="create new board"
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  const boards = await prisma.board.findMany();

  if (!!boards.length) {
    return {
      redirect: {
        destination: `/dashboard/${boards[0].id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      boards,
    },
  };
}

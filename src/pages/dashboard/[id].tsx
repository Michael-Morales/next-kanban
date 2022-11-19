import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";
import { getBoards } from "@api/boards";
import { getBoardById } from "@api/boards/[id]";

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
  const boards = await getBoards();
  const board = await getBoardById(params?.id as string);

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

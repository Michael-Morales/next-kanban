import type { GetServerSidePropsContext } from "next";
import type {
  Board,
  Column as ColumnType,
  Task,
  Subtask,
} from "@prisma/client";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";
import { getBoards } from "@api/boards";
import { getBoardById } from "@api/boards/[id]";
import axios from "@lib/axios";

export default function Board() {
  const router = useRouter();
  const { data: board } = useQuery<
    Board & {
      columns: (ColumnType & { tasks: (Task & { subtasks: Subtask[] })[] })[];
    }
  >({
    queryKey: ["boards", router.query.id],
    queryFn: async () => {
      const { data } = await axios.get(`/boards/${router.query.id}`);
      return data;
    },
  });

  return (
    <Layout>
      <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
        {board?.columns.map((column) => (
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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["boards"], getBoards);
  const board = await queryClient.fetchQuery(["boards", params?.id], () =>
    getBoardById(params?.id as string)
  );

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
      dehydratedState: dehydrate(queryClient),
    },
  };
}

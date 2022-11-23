import type { GetServerSidePropsContext } from "next";
import type { DropResult } from "react-beautiful-dnd";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { DragDropContext } from "react-beautiful-dnd";

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";
import { getBoards } from "@api/boards";
import { getBoardById } from "@api/boards/[id]";
import { getTasksByColumnId } from "@api/tasks";
import { useBoard, useTasks } from "@features/dashboard";

export default function Board() {
  const router = useRouter();
  const {
    query: { data: board },
  } = useBoard(router.query.id as string);
  const { moveMutation } = useTasks();

  const onDrop = (result: DropResult) => {
    moveMutation.mutate(result);
  };

  return (
    <Layout>
      <DragDropContext onDragEnd={onDrop}>
        <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
          {board?.columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <NewColumn />
        </div>
      </DragDropContext>
    </Layout>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ["boards"], queryFn: getBoards });
  const board = await queryClient.fetchQuery({
    queryKey: ["boards", params?.id],
    queryFn: () => getBoardById(params?.id as string),
  });

  if (!board) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  await Promise.all(
    board.columns.map(({ id }) =>
      queryClient.prefetchQuery({
        queryKey: ["tasks", id],
        queryFn: () => getTasksByColumnId(id),
      })
    )
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

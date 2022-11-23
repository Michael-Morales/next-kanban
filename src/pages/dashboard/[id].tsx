import type { GetServerSidePropsContext } from "next";
import type {
  Board,
  Column as ColumnType,
  Subtask,
  Task,
} from "@prisma/client";
import type { DropResult } from "react-beautiful-dnd";
import {
  QueryClient,
  dehydrate,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import { DragDropContext } from "react-beautiful-dnd";

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";
import { getBoards } from "@api/boards";
import { getBoardById } from "@api/boards/[id]";
import { getTasksByColumnId } from "@api/tasks";
import axios from "@lib/axios";

export default function Board() {
  const router = useRouter();
  const { data: board } = useQuery<
    Board & {
      columns: ColumnType[];
    }
  >({
    queryKey: ["boards", router.query.id],
    queryFn: async () => {
      const { data } = await axios.get(`/boards/${router.query.id}`);
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: DropResult) => axios.patch("/tasks", values),
    onMutate: async ({ source, destination }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const sourceTasks = queryClient.getQueryData<
        (Task & { subtasks: Subtask[] })[]
      >(["tasks", source.droppableId]);

      if (!destination) {
        return;
      }

      if (sourceTasks) {
        if (source.droppableId === destination.droppableId) {
          if (source.index === destination.index) {
            return;
          }
          const sourceCopy = [...sourceTasks];
          const element = sourceCopy[source.index];
          sourceCopy.splice(source.index, 1);
          sourceCopy.splice(destination.index, 0, element);
          const updatedTasksPositions = sourceCopy.map((task, i) => ({
            ...task,
            position: i,
          }));
          queryClient.setQueryData(
            ["tasks", source.droppableId],
            updatedTasksPositions
          );
        } else {
          const destinationTasks = queryClient.getQueryData<
            (Task & { subtasks: Subtask[] })[]
          >(["tasks", destination.droppableId]);
          const sourceCopy = [...sourceTasks];
          const element = sourceCopy[source.index];
          element.columnId = destination.droppableId;
          sourceCopy.splice(source.index, 1);
          destinationTasks?.splice(destination.index, 0, element);
          const updatedSourcePositions = sourceCopy.map((task, i) => ({
            ...task,
            position: i,
          }));
          const updatedDestinationPositions = destinationTasks?.map(
            (task, i) => ({ ...task, position: i })
          );
          queryClient.setQueryData(
            ["tasks", source.droppableId],
            updatedSourcePositions
          );
          queryClient.setQueryData(
            ["tasks", destination.droppableId],
            updatedDestinationPositions
          );
        }
      }

      return { sourceTasks };
    },
    onError: (_, { source }, context) => {
      queryClient.setQueryData(
        ["tasks", source.droppableId],
        context?.sourceTasks
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const onDrop = (result: DropResult) => {
    mutation.mutate(result);
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

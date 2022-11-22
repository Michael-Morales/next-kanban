import type { GetServerSidePropsContext } from "next";
import type {
  Board,
  Column as ColumnType,
  Task,
  Subtask,
} from "@prisma/client";
import type { DropResult } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
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
import { getTasks } from "@api/tasks";
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
  const { data: tasks, isSuccess } = useQuery<
    (Task & { subtasks: Subtask[] })[]
  >({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get("/tasks");
      return data;
    },
    enabled: !!board,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: DropResult) => axios.patch("/tasks", values),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
  const [tasksState, setTasksState] = useState<
    (Task & { subtasks: Subtask[] })[]
  >([]);

  const onDrop = (result: DropResult) => {
    mutation.mutate(result);
  };

  useEffect(() => {
    if (isSuccess) {
      setTasksState(tasks);
    }
  }, [isSuccess, tasks]);

  return (
    <Layout>
      <DragDropContext onDragEnd={onDrop}>
        <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
          {board?.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasksState.filter(
                ({ columnId }) => columnId === column.id
              )}
            />
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
  await queryClient.prefetchQuery({ queryKey: ["tasks"], queryFn: getTasks });
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

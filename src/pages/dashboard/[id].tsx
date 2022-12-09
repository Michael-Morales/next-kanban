import type { GetServerSidePropsContext } from "next";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import type { Task } from "@prisma/client";
import { useState } from "react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Layout } from "@features/ui";
import { Column, NewColumn, Card } from "@features/dashboard";
import { getBoards } from "@api/boards";
import { getBoardById } from "@api/boards/[id]";
import { getColumnsByBoardId } from "@api/columns";
import { getTasksByColumnId } from "@api/tasks";
import { getSubtasksByTaskId } from "@api/subtasks";
import { useTasks, useColumns } from "@features/dashboard";
import { authOptions } from "@api/auth/[...nextauth]";

export default function Board() {
  const router = useRouter();
  const {
    query: { data: columns },
  } = useColumns(router.query.id as string);
  const { moveMutation } = useTasks();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // activationConstraint: { delay: 50, distance: 0, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const [activeCard, setActiveCard] = useState<Task | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveCard(active.data.current?.task);
  };

  const handleDragOver = (res: DragOverEvent) => {
    console.log(res);
  };

  const handleDragEnd = (result: DragEndEvent) => {
    // console.log(result);
    setActiveCard(null);
  };

  return (
    <Layout>
      <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={closestCorners}
          sensors={sensors}
        >
          {columns?.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <DragOverlay>
            {activeCard ? <Card task={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
        <NewColumn />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["boards"],
    queryFn: () => getBoards(session.user.userId),
  });
  const board = await queryClient.fetchQuery({
    queryKey: ["boards", params?.id],
    queryFn: () => getBoardById(params?.id as string),
  });

  if (!board) {
    return {
      notFound: true,
    };
  }

  const columns = await queryClient.fetchQuery({
    queryKey: ["columns", params?.id],
    queryFn: () => getColumnsByBoardId(params?.id as string),
  });

  await Promise.all(
    columns.map(async ({ id }) => {
      const tasks = await queryClient.fetchQuery({
        queryKey: ["tasks", id],
        queryFn: () => getTasksByColumnId(id),
      });

      await Promise.all(
        tasks.map(
          async ({ id }) =>
            await queryClient.prefetchQuery({
              queryKey: ["subtasks", id],
              queryFn: () => getSubtasksByTaskId(id),
            })
        )
      );
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

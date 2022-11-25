import type { Task, Subtask } from "@prisma/client";
import type { DropResult } from "react-beautiful-dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { ICreateTask } from "@lib/validation";
import axios from "@lib/axios";

async function getTasksByColumnId(id?: string) {
  const { data } = await axios.get("/tasks", { params: { id } });
  return data;
}

export function useTasks(id?: string, callback?: () => void) {
  const queryClient = useQueryClient();

  const query = useQuery<(Task & { subtasks: Subtask[] })[]>({
    queryKey: ["tasks", id],
    queryFn: () => getTasksByColumnId(id),
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (values: ICreateTask) => axios.post("/tasks", values),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", id]);
      queryClient.invalidateQueries(["subtasks"]);
      callback && callback();
    },
  });

  const moveMutation = useMutation({
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

  return { query, createMutation, moveMutation };
}

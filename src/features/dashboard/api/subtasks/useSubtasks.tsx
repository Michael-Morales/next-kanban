import type { Subtask } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { IToggleSubtask } from "@lib/validation";
import axios from "@lib/axios";

async function getSubtasksByTaskId(id: string) {
  const { data } = await axios.get("/subtasks", { params: { id } });
  return data;
}

export function useSubtasks(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Subtask[]>({
    queryKey: ["subtasks", id],
    queryFn: () => getSubtasksByTaskId(id),
    refetchOnWindowFocus: false,
  });

  const toggleMutation = useMutation({
    mutationFn: (values: IToggleSubtask) => axios.patch("/subtasks", values),
    onMutate: async ({ taskId, subtasks }) => {
      await queryClient.cancelQueries({ queryKey: ["subtasks", taskId] });
      const previousSubtasks = queryClient.getQueryData<Subtask[]>([
        "subtasks",
        taskId,
      ]);
      const subtasksSet = new Set(subtasks);
      const updatedSubtasks = previousSubtasks?.map((subtask) =>
        subtasksSet.has(subtask.id)
          ? {
              ...subtask,
              isCompleted: true,
            }
          : { ...subtask, isCompleted: false }
      );
      queryClient.setQueryData(["subtasks", taskId], updatedSubtasks);
      return { previousSubtasks };
    },
    onError: (_, { taskId }, context) => {
      queryClient.setQueryData(["subtasks", taskId], context?.previousSubtasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["subtasks", id]);
    },
  });

  return { query, toggleMutation };
}

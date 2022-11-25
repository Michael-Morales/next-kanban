import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IUpdateTask } from "@lib/validation";
import axios from "@lib/axios";

export function useTask(id?: string, columnId?: string, callback?: () => void) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (values: IUpdateTask) => axios.patch(`/tasks/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", columnId]);
      callback && callback();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", columnId]);
      callback && callback();
    },
  });

  return { updateMutation, deleteMutation };
}

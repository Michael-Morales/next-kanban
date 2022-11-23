import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { IToggleSubtask } from "@lib/validation";
import axios from "@lib/axios";

export function useSubtasks() {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (values: IToggleSubtask) => axios.patch("/subtasks", values),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  return { toggleMutation };
}

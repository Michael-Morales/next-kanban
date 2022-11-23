import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ICreateColumn } from "@lib/validation";
import axios from "@lib/axios";

export function useColumns(callback?: () => void) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: ICreateColumn) => axios.post("/columns", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      callback && callback();
    },
  });

  return { createMutation };
}

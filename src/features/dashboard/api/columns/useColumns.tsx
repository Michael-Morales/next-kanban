import type { Column } from "@prisma/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import type { ICreateColumn } from "@lib/validation";
import axios from "@lib/axios";

async function getColumnsByBoardId(id: string) {
  const { data } = await axios.get("columns", { params: { id } });
  return data;
}

export function useColumns(id: string, callback?: () => void) {
  const queryClient = useQueryClient();

  const query = useQuery<Column[]>({
    queryKey: ["columns", id],
    queryFn: () => getColumnsByBoardId(id),
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (values: ICreateColumn) => axios.post("/columns", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["columns"] });
      callback && callback();
    },
  });

  return { query, createMutation };
}

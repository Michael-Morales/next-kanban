import type { Board, Column } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { IUpdateBoard } from "@lib/validation";
import axios from "@lib/axios";

async function getBoard(id: string) {
  const { data } = await axios.get(`/boards/${id}`);
  return data;
}

export function useBoard(id: string, callback?: () => void) {
  const queryClient = useQueryClient();

  const query = useQuery<Board & { columns: Column[] }>({
    queryKey: ["boards", id],
    queryFn: () => getBoard(id),
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: (values: IUpdateBoard) => axios.patch(`/boards/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      callback && callback();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/boards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      callback && callback();
    },
  });

  return { query, updateMutation, deleteMutation };
}

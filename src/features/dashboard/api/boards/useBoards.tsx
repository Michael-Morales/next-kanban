import type { Board } from "@prisma/client";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { ICreateBoard } from "@lib/validation";
import axios from "@lib/axios";

async function getBoards() {
  const { data } = await axios.get("/boards");
  return data;
}

export function useBoards(callback?: (id: string) => void) {
  const query = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (values: ICreateBoard) => axios.post("/boards", values),
    onSuccess: ({ data }) => callback && callback(data.boardId),
  });

  return { query, createMutation };
}

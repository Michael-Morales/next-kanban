import type { Column, Task, Subtask } from "@prisma/client";
import { Droppable } from "react-beautiful-dnd";
import { useQuery } from "@tanstack/react-query";

import { Card } from "../card";
import { NewTask } from "@features/dashboard";
import axios from "@lib/axios";

interface IProps {
  column: Column;
}

export function Column({ column }: IProps) {
  const { id, name } = column;
  const { data: tasks } = useQuery<(Task & { subtasks: Subtask[] })[]>({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const { data } = await axios.get("/tasks", { params: { id } });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="shrink-0 grow-0 basis-72">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest">
        {name} ({tasks?.length || 0})
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mb-5 flex flex-col gap-y-5"
          >
            {tasks?.map((task, i) => (
              <Card key={task.id} task={task} idx={i} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <NewTask columnId={id} newIdx={tasks?.length || 0} />
    </div>
  );
}

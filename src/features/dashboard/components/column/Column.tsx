import type { Column, Task, Subtask } from "@prisma/client";
import { Droppable } from "react-beautiful-dnd";

import { Card } from "../card";
import { NewTask } from "@features/dashboard";

interface IProps {
  column: Column & { tasks: (Task & { subtasks: Subtask[] })[] };
}

export function Column({ column }: IProps) {
  const { id, name, tasks } = column;

  return (
    <div className="shrink-0 grow-0 basis-72">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest">
        {name} ({tasks.length})
      </h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="mb-5 flex flex-col gap-y-5"
          >
            {tasks.map((task, i) => (
              <Card key={task.id} task={task} idx={i} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <NewTask columnId={id} newIdx={tasks.length} />
    </div>
  );
}

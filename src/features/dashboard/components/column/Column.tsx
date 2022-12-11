import type { Column } from "@prisma/client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card } from "../card";
import { NewTask, useTasks } from "@features/dashboard";

interface IProps {
  column: Column;
}

export function Column({ column }: IProps) {
  const { id, name } = column;
  const {
    query: { data: tasks },
  } = useTasks(id);
  const { setNodeRef } = useDroppable({
    id,
  });
  const taskIds = tasks?.map(({ id }) => id);

  return (
    <div className="shrink-0 grow-0 basis-72">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest">
        {name} ({tasks?.length || 0})
      </h2>
      <SortableContext
        id={id}
        items={taskIds!}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="mb-5 flex flex-col gap-y-5">
          {tasks?.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
      <NewTask columnId={id} newIdx={tasks?.length || 0} />
    </div>
  );
}

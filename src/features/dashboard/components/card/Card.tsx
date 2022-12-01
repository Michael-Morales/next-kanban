import type { Task } from "@prisma/client";
import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";

import { TaskView, useSubtasks } from "@features/dashboard";
import { Modal, IModalHandle } from "@features/ui";

interface IProps {
  task: Task;
  idx: number;
}

export function Card({ task, idx }: IProps) {
  const { id, title, description } = task;
  const {
    query: { data: subtasks },
  } = useSubtasks(id);
  const completedSubtasks = subtasks
    ?.filter(({ isCompleted }) => isCompleted)
    .map(({ id }) => id);
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <Draggable draggableId={id} index={idx}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="card group cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow transition-colors dark:bg-theme-dark"
            onClick={() => modalRef.current?.open()}
          >
            <h3 className="mb-2 font-bold text-black transition-colors group-hover:text-primary dark:text-white">
              {title}
            </h3>
            <p className="text-xs font-bold">
              {!!subtasks?.length
                ? `${completedSubtasks?.length} of ${subtasks.length} subtasks`
                : "No subtask"}
            </p>
          </div>
        )}
      </Draggable>
      <Modal ref={modalRef} title={title} task={task}>
        <TaskView
          taskId={task.id}
          description={description}
          subtasks={subtasks}
          completedSubtasks={completedSubtasks}
          onClose={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}

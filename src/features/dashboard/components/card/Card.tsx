import type { Task, Subtask } from "@prisma/client";
import { useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import { TaskView } from "@features/dashboard";
import { Modal, IModalHandle } from "@features/ui";

interface IProps {
  task: Task & { subtasks: Subtask[] };
  idx: number;
}

export function Card({ task, idx }: IProps) {
  const { id, title, subtasks, description } = task;
  const completedSubtasks = subtasks
    .filter(({ isCompleted }) => isCompleted)
    .map(({ id }) => id);
  const modalRef = useRef<IModalHandle>(null);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return (
    <>
      <Draggable draggableId={id} index={idx}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`group cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow ${
              isFetching || isMutating ? "pointer-events-none opacity-50" : ""
            }`}
            onClick={() => modalRef.current?.open()}
          >
            <h3 className="mb-2 font-bold text-black transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="text-xs font-bold">
              {!!subtasks.length
                ? `${completedSubtasks.length} of ${subtasks.length} subtasks`
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

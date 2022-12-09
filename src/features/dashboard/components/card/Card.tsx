import type { Task } from "@prisma/client";
import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";

import { TaskView, useSubtasks } from "@features/dashboard";
import { Modal, IModalHandle } from "@features/ui";

interface IProps {
  task: Task;
}

export function Card({ task }: IProps) {
  const { id, title, description } = task;
  const {
    query: { data: subtasks },
  } = useSubtasks(id);
  const completedSubtasks = subtasks
    ?.filter(({ isCompleted }) => isCompleted)
    .map(({ id }) => id);
  const modalRef = useRef<IModalHandle>(null);
  const { setNodeRef, listeners, transform, transition, isDragging } =
    useSortable({
      id,
      data: {
        task,
      },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        className={`card group cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow transition-colors dark:bg-theme-dark ${
          isDragging ? "invisible" : ""
        }`}
        onClick={() => modalRef.current?.open()}
        style={style}
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

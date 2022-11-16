import { useRef } from "react";

import { ITask, TaskView } from "@features/dashboard";
import { Modal, IModalHandle } from "@features/ui";

interface IProps {
  task: ITask;
}

export function Card({ task }: IProps) {
  const { title, subtasks, description } = task;
  const completedSubtasks = subtasks
    .filter(({ isCompleted }) => isCompleted)
    .map(({ id }) => id);
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <div
        className="group cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow"
        onClick={() => modalRef.current?.open()}
      >
        <h3 className="mb-2 font-bold text-black transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="text-xs font-bold">
          {completedSubtasks.length} of {subtasks.length} subtasks
        </p>
      </div>
      <Modal ref={modalRef} title={title} task>
        <TaskView
          description={description}
          subtasks={subtasks}
          completedSubtasks={completedSubtasks}
          onClose={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}

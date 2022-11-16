import { useRef } from "react";

import { ITask } from "@features/dashboard";
import { Modal, IModalHandle } from "@features/ui";

interface IProps {
  task: ITask;
}

export function Card({ task }: IProps) {
  const { title, subtasks } = task;
  const completedSubtasks = subtasks.filter(({ isCompleted }) => isCompleted);
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <div
        className="cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow"
        onClick={() => modalRef.current?.open()}
      >
        <h3 className="mb-2 font-bold text-black">{title}</h3>
        <p className="text-xs font-bold">
          {completedSubtasks.length} of {subtasks.length} subtasks
        </p>
      </div>
      <Modal ref={modalRef} title={title} task>
        <div>hello</div>
      </Modal>
    </>
  );
}

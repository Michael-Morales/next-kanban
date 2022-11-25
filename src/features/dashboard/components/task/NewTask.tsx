import { useRef } from "react";

import { Modal, IModalHandle } from "@features/ui";
import { CreateTask } from "./CreateTask";

interface IProps {
  columnId: string;
  newIdx: number;
}

export function NewTask({ columnId, newIdx }: IProps) {
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <button
        className="w-full rounded-lg bg-light-blue px-4 py-6 font-bold capitalize transition-colors hover:text-primary dark:bg-theme-dark"
        onClick={() => modalRef.current?.open()}
      >
        add task
      </button>
      <Modal ref={modalRef} title="Add new task">
        <CreateTask
          columnId={columnId}
          newIdx={newIdx}
          onClose={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}

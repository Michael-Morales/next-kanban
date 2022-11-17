import { useRef } from "react";

import { Modal, IModalHandle } from "@features/ui";
import { CreateTask } from "./CreateTask";

interface IProps {
  columnId: string;
}

export function NewTask({ columnId }: IProps) {
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <button
        className="rounded-lg bg-gradient-to-b from-light-blue px-4 py-6 font-bold capitalize transition-colors hover:text-primary"
        onClick={() => modalRef.current?.open()}
      >
        add task
      </button>
      <Modal ref={modalRef} title="Add new task">
        <CreateTask
          columnId={columnId}
          onClose={() => modalRef.current?.close()}
        />
      </Modal>
    </>
  );
}

import { useRef } from "react";

import { Modal, IModalHandle } from "@features/ui";
import { CreateColumn } from "./CreateColumn";

export function NewColumn() {
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <button
        className="shrink-0 grow-0 basis-72 rounded-lg bg-light-blue text-2xl font-bold capitalize transition-colors hover:text-primary dark:bg-theme-dark"
        onClick={() => modalRef.current?.open()}
      >
        add column
      </button>
      <Modal ref={modalRef} title="Add new column">
        <CreateColumn onClose={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}

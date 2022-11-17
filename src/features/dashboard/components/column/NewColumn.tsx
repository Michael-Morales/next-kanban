import { useRef } from "react";

import { Modal, IModalHandle } from "@features/ui";
import { CreateColumn } from "./CreateColumn";

export function NewColumn() {
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <button
        className="mt-10 shrink-0 grow-0 basis-72 rounded-lg bg-gradient-to-b from-light-blue text-2xl font-bold capitalize transition-colors hover:text-primary"
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

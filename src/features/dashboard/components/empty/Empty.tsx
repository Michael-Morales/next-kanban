import { useRef } from "react";

import { Button, Modal, IModalHandle } from "@features/ui";
import { CreateBoard } from "@features/dashboard";

interface IProps {
  title: string;
  buttonLabel: string;
}

export function Empty({ title, buttonLabel }: IProps) {
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <div className="flex h-[calc(100%-60px)] flex-col items-center justify-center md:h-[calc(100%-64px)]">
        <div className="mx-4 flex flex-col items-center">
          <p className="mb-6 text-center text-lg font-bold">{title}</p>
          <Button onClick={() => modalRef.current?.open()}>
            {buttonLabel}
          </Button>
        </div>
      </div>
      <Modal ref={modalRef} title="Add new board">
        <CreateBoard onClose={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}

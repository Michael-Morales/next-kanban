import {
  useState,
  forwardRef,
  useImperativeHandle,
  MouseEvent,
  useRef,
} from "react";

import { Modal, IModalHandle } from "@features/ui";
import { ITask, EditTask, IBoard } from "@features/dashboard";

interface IProps {
  title: string;
  item: ITask | IBoard;
  closeRootModal?: () => void;
}

export interface IMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

export const Menu = forwardRef<IMenuHandle, IProps>(function Menu(
  { title, item, closeRootModal },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const editModalRef = useRef<IModalHandle>(null);
  const deleteModalRef = useRef<IModalHandle>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
      isOpen,
    }),
    [isOpen]
  );

  return (
    <>
      <div
        className={`absolute top-[calc(100%+8px)] right-2 flex w-48 origin-top flex-col gap-y-4 rounded-lg bg-white p-4 text-sm shadow-lg transition-transform md:right-8 ${
          isOpen ? "scale-y-1" : "scale-y-0"
        }`}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <button
          className="text-left font-bold capitalize"
          onClick={() => editModalRef.current?.open()}
        >
          edit {title}
        </button>
        <button
          className="text-left font-bold capitalize text-danger"
          onClick={() => deleteModalRef.current?.open()}
        >
          delete {title}
        </button>
      </div>
      <Modal ref={editModalRef} title={`Edit ${title}`}>
        {title === "task" ? (
          <EditTask onClose={closeRootModal} task={item as ITask} />
        ) : (
          <div></div>
        )}
      </Modal>
      {/* <Modal ref={deleteModalRef} title="Delete task">
  
        </Modal> */}
    </>
  );
});

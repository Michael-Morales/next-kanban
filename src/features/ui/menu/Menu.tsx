import type { Board, Column, Task, Subtask } from "@prisma/client";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  MouseEvent,
  useRef,
} from "react";

import { Modal, IModalHandle, DeleteModal } from "@features/ui";
import { EditTask, EditBoard } from "@features/dashboard";

interface IProps {
  task?: Task & { subtasks: Subtask[] };
  board?: Board & { columns: Column[] };
  closeRootModal?: () => void;
}

export interface IMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

export const Menu = forwardRef<IMenuHandle, IProps>(function Menu(
  { task, board, closeRootModal },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const editModalRef = useRef<IModalHandle>(null);
  const deleteModalRef = useRef<IModalHandle>(null);

  const title = task ? "task" : "board";

  const handleDelete = () => {
    if (task) {
      console.log("delete task");
    } else if (board) {
      console.log("delete board");
    }
  };

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
        {task ? (
          <EditTask onClose={closeRootModal!} task={task!} />
        ) : (
          <EditBoard onClose={closeRootModal!} board={board!} />
        )}
      </Modal>
      <Modal ref={deleteModalRef} title={`Delete this ${title}`} type="delete">
        {task ? (
          <DeleteModal
            content={`Are you sure you want to delete the ‘${task?.title}’ task and its subtasks? This action cannot be reversed.`}
            onDelete={handleDelete}
            onCancel={() => deleteModalRef.current?.close()}
            onClose={closeRootModal!}
          />
        ) : (
          <DeleteModal
            content={`Are you sure you want to delete the ‘${board?.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
            onDelete={handleDelete}
            onCancel={() => deleteModalRef.current?.close()}
            onClose={() => deleteModalRef.current?.close()}
          />
        )}
      </Modal>
    </>
  );
});

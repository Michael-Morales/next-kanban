import type { Task } from "@prisma/client";
import {
  useState,
  forwardRef,
  useImperativeHandle,
  MouseEvent,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

import { Modal, IModalHandle, DeleteModal, Button } from "@features/ui";
import { EditTask, EditBoard, useBoard, useTask } from "@features/dashboard";
import { useRouteChange } from "@hooks/useRouteChange";

interface IProps {
  task?: Task;
  closeRootModal?: () => void;
}

export interface IMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

export const Menu = forwardRef<IMenuHandle, IProps>(function Menu(
  { task, closeRootModal },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const editModalRef = useRef<IModalHandle>(null);
  const deleteModalRef = useRef<IModalHandle>(null);
  const router = useRouter();
  const { deleteMutation: taskMutation } = useTask(
    task?.id,
    task?.columnId,
    () => {
      closeRootModal && closeRootModal();
    }
  );
  const {
    query: { data: board },
    deleteMutation: boardMutation,
  } = useBoard(router.query.id as string, () => {
    router.push("/dashboard");
  });

  const title = task ? "task" : "board";

  const handleDelete = async () => {
    if (task && closeRootModal) {
      taskMutation.mutate();
    } else if (board) {
      boardMutation.mutate();
    }
    setIsOpen(false);
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

  const handleCloseDeleteModal = () => {
    deleteModalRef.current?.close();
  };

  useRouteChange(handleCloseDeleteModal);

  return (
    <>
      <div
        className={`absolute top-[calc(100%+8px)] right-2 flex w-48 origin-top flex-col gap-y-4 rounded-lg bg-white p-4 text-sm shadow-lg transition dark:bg-dark md:right-8 ${
          isOpen ? "scale-y-1" : "scale-y-0"
        }`}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {(task || board) && (
          <>
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
          </>
        )}
        {!task && (
          <Button
            buttonStyle="danger"
            size="small"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            sign out
          </Button>
        )}
      </div>
      {task && (
        <>
          <Modal ref={editModalRef} title={`Edit ${title}`}>
            <EditTask onClose={closeRootModal!} task={task} />
          </Modal>
          <Modal
            ref={deleteModalRef}
            title={`Delete this ${title}`}
            type="delete"
          >
            <DeleteModal
              content={`Are you sure you want to delete the ‘${task.title}’ task and its subtasks? This action cannot be reversed.`}
              onDelete={handleDelete}
              onClose={() => deleteModalRef.current?.close()}
              loading={taskMutation.isLoading}
            />
          </Modal>
        </>
      )}
      {!task && board && (
        <>
          <Modal ref={editModalRef} title={`Edit ${title}`}>
            <EditBoard
              onClose={() => editModalRef.current?.close()}
              board={board}
            />
          </Modal>
          <Modal
            ref={deleteModalRef}
            title={`Delete this ${title}`}
            type="delete"
          >
            <DeleteModal
              content={`Are you sure you want to delete the ‘${board.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
              onDelete={handleDelete}
              onClose={() => deleteModalRef.current?.close()}
              loading={boardMutation.isLoading}
            />
          </Modal>
        </>
      )}
    </>
  );
});

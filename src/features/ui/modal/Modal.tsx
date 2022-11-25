import type { Task, Subtask } from "@prisma/client";
import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import { Overlay } from "./Overlay";
import { Menu, IMenuHandle, EllipsisIcon } from "@features/ui";

interface IProps {
  children: JSX.Element;
  title: string;
  task?: Task;
  type?: "delete";
}

export interface IModalHandle {
  open: () => void;
  close: () => void;
}

export const Modal = forwardRef<IModalHandle, IProps>(function Modal(
  { children, title, task, type },
  ref
) {
  const [isBrowser, setIsBrowser] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const menuRef = useRef<IMenuHandle>(null);

  const handleMenu = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    menuRef.current?.toggle();
  };

  const handleMenuClose = () => {
    if (menuRef.current?.isOpen) {
      menuRef.current?.close();
    }
  };

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setModalOpen(true),
      close: () => setModalOpen(false),
    }),
    []
  );

  const ModalContent = modalOpen ? (
    <>
      <Overlay show={modalOpen} onDismiss={() => setModalOpen(false)} />
      <CSSTransition
        key="modal"
        in={modalOpen}
        nodeRef={modalRef}
        timeout={150}
        appear
        unmountOnExit
        classNames={{
          enter: "opacity-0",
          enterActive: "transition-opacity opacity-100",
          enterDone: "opacity-100",
          appear: "opacity-0",
          appearActive: "transition-opacity opacity-100",
          exit: "opacity-100",
          exitActive: "transition-opacity opacity-100",
          exitDone: "opacity-0",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 z-20 flex max-h-[90%] w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-y-6 overflow-y-auto rounded-lg bg-white p-6 dark:bg-theme-dark md:p-8"
          onClick={handleMenuClose}
          ref={modalRef}
        >
          <div className="relative flex items-center justify-between gap-x-6">
            <h3
              className={`flex-1 text-lg font-bold ${
                type ? "text-danger" : "text-black dark:text-white"
              }`}
            >
              {title}
            </h3>
            {task && (
              <>
                <button className="px-2.5" onClick={handleMenu}>
                  <EllipsisIcon />
                </button>
                <Menu
                  ref={menuRef}
                  task={task}
                  closeRootModal={() => setModalOpen(false)}
                />
              </>
            )}
          </div>
          {children}
        </div>
      </CSSTransition>
    </>
  ) : null;

  if (isBrowser) {
    return createPortal(
      ModalContent,
      document.querySelector("#modal") as HTMLDivElement
    );
  } else {
    return null;
  }
});

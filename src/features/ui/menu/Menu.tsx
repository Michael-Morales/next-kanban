import { useState, forwardRef, useImperativeHandle, MouseEvent } from "react";

interface IProps {
  title: string;
}

export interface IMenuHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

export const Menu = forwardRef<IMenuHandle, IProps>(function Menu(
  { title },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);

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
    <div
      className={`absolute top-[calc(100%+8px)] right-2 flex w-48 origin-top flex-col gap-y-4 rounded-lg bg-white p-4 text-sm shadow-lg transition-transform md:right-8 ${
        isOpen ? "scale-y-1" : "scale-y-0"
      }`}
      onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <button className="text-left font-bold capitalize">edit {title}</button>
      <button className="text-left font-bold capitalize text-danger">
        delete {title}
      </button>
    </div>
  );
});

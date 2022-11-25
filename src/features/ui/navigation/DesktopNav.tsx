import { HideSidebarIcon } from "@features/ui";

import { Nav } from "./Nav";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopNav({ isOpen, onClose }: IProps) {
  return (
    <div
      className={`fixed z-20 hidden h-[calc(100vh-64px)] w-72 overflow-y-auto border-t border-secondary bg-white p-8 transition dark:border-theme-light-dark dark:bg-theme-dark md:flex md:flex-col md:justify-between ${
        isOpen ? "translate-x-0" : "-translate-x-72"
      }`}
    >
      <Nav />
      <button
        className="group relative flex items-center gap-x-4 py-3 font-bold capitalize text-body transition-colors hover:text-primary"
        onClick={onClose}
      >
        <span className="absolute -left-8 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors group-hover:bg-secondary" />
        <HideSidebarIcon className="fill-body transition-colors group-hover:fill-primary" />
        hide sidebar
      </button>
    </div>
  );
}

import type { Board } from "@prisma/client";

import { Nav } from "./Nav";

interface IProps {
  isOpen: boolean;
  boards: Board[];
}

export function MobileNav({ isOpen, boards }: IProps) {
  return (
    <div
      className={`absolute top-20 left-14 z-20 max-h-[80vh] w-72 origin-top overflow-y-auto rounded-lg bg-white py-4 px-6 shadow-lg transition-transform md:hidden ${
        isOpen ? "scale-y-1" : "scale-y-0"
      }`}
    >
      <Nav boards={boards} />
    </div>
  );
}

import Link from "next/link";
import { useRouter } from "next/router";

import { BoardIcon } from "@features/ui";

interface IProps {
  isOpen: boolean;
}

export function MobileNav({ isOpen }: IProps) {
  const router = useRouter();

  // check query id against props id
  const active = true;

  return (
    <div
      className={`absolute top-20 left-14 max-h-[70vh] w-72 overflow-y-auto rounded-lg bg-white py-4 px-6 shadow-lg transition-transform md:hidden ${
        isOpen ? "translate-y-0" : "-translate-y-[2000px]"
      }`}
    >
      <p className="mb-5 text-xs font-bold uppercase tracking-widest">
        {/* add number of boards */}
        all boards (0)
      </p>
      <nav className="isolate flex flex-col">
        <Link
          className={`group relative flex items-center gap-x-3 py-3 font-bold capitalize transition-colors ${
            active ? "text-white" : "hover:text-primary"
          }`}
          href="/dashboard/1"
        >
          <span
            className={`absolute -left-6 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors ${
              active ? "bg-primary" : "group-hover:bg-secondary"
            }`}
          />
          <BoardIcon
            className={
              active
                ? "fill-white"
                : "fill-body transition-colors group-hover:fill-primary"
            }
          />
          board 1
        </Link>
      </nav>
      <button className="group relative isolate flex items-center gap-x-3 py-3 font-bold capitalize text-primary transition-colors">
        <span className="absolute -left-6 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors group-hover:bg-secondary" />
        <BoardIcon className="fill-primary" />
        create new board
      </button>
    </div>
  );
}

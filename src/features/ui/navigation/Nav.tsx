import Link from "next/link";
import { useRouter } from "next/router";

import { BoardIcon } from "@features/ui";

export function Nav() {
  const router = useRouter();

  // check query id against props id
  const active = true;

  return (
    <div>
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
            className={`absolute -left-6 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors md:-left-8 ${
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
        <span className="absolute -left-6 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors group-hover:bg-secondary md:-left-8" />
        <BoardIcon className="fill-primary" />
        create new board
      </button>
    </div>
  );
}

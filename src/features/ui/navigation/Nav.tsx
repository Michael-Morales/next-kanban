import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { BoardIcon, Modal, IModalHandle } from "@features/ui";
import { CreateBoard } from "@features/dashboard";

import data from "../../../data.json";

export function Nav() {
  const router = useRouter();
  const modalRef = useRef<IModalHandle>(null);

  return (
    <>
      <div>
        <p className="mb-5 text-xs font-bold uppercase tracking-widest">
          all boards ({data.length})
        </p>
        <nav className="isolate flex flex-col">
          {data.map(({ id, name }) => {
            const active = router.query.id === id;

            return (
              <Link
                key={id}
                className={`group relative flex items-center gap-x-3 py-3 font-bold capitalize transition-colors ${
                  active ? "text-white" : "hover:text-primary"
                }`}
                href={`/dashboard/${id}`}
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
                {name}
              </Link>
            );
          })}
        </nav>
        <button
          className="group relative isolate flex items-center gap-x-3 py-3 font-bold capitalize text-primary transition-colors"
          onClick={() => modalRef.current?.open()}
        >
          <span className="absolute -left-6 -z-10 h-full w-64 rounded-tr-full rounded-br-full transition-colors group-hover:bg-secondary md:-left-8" />
          <BoardIcon className="fill-primary" />
          create new board
        </button>
      </div>
      <Modal ref={modalRef} title="Add new board">
        <CreateBoard onClose={() => modalRef.current?.close()} />
      </Modal>
    </>
  );
}

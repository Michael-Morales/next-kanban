import { useState, useRef } from "react";
import Head from "next/head";

import { Header, DesktopNav, ShowSidebarIcon } from "@features/ui";
import { IBoard } from "@features/dashboard";

interface IProps {
  children: JSX.Element;
  board?: IBoard;
  boards: IBoard[];
}

export function Layout({ children, board, boards }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<{ closeMenu: () => void }>(null);

  return (
    <>
      <Head>
        <title>Next Kanban</title>
        <meta
          name="description"
          content="Kanban application created with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header ref={headerRef} board={board!} boards={boards} />
      <div className="flex" onClick={() => headerRef.current?.closeMenu()}>
        <DesktopNav
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          boards={boards}
        />
        <main
          className={`h-[calc(100vh-60px)] w-full overflow-auto transition-[margin-left] md:h-[calc(100vh-68px)] ${
            isOpen ? "ml-72" : "ml-0"
          }`}
        >
          {children}
        </main>
        <button
          className="fixed bottom-8 z-10 hidden rounded-tr-full rounded-br-full bg-primary p-4 hover:bg-hover-primary md:block"
          onClick={() => setIsOpen(true)}
        >
          <ShowSidebarIcon className="fill-white" />
        </button>
      </div>
    </>
  );
}

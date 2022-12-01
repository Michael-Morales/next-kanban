import { useState, useRef } from "react";
import Head from "next/head";
import ScrollContainer from "react-indiana-drag-scroll";

import { Header, DesktopNav, ShowSidebarIcon } from "@features/ui";

interface IProps {
  children: JSX.Element;
}

export function Layout({ children }: IProps) {
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
      <Header ref={headerRef} />
      <div
        className="flex h-[calc(100%-60px)] md:h-[calc(100%-64px)]"
        onClick={() => headerRef.current?.closeMenu()}
      >
        <DesktopNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <ScrollContainer
          className={`relative h-full w-full overflow-auto transition-all ${
            isOpen ? "ml-72" : "ml-0"
          }`}
          component="main"
          ignoreElements=".card"
        >
          {children}
        </ScrollContainer>
        <button
          className="fixed bottom-8 z-10 hidden rounded-tr-full rounded-br-full bg-primary p-4 hover:bg-hover-primary md:block"
          onClick={() => setIsOpen(true)}
          aria-label="open navigation"
        >
          <ShowSidebarIcon className="fill-white" />
        </button>
      </div>
    </>
  );
}

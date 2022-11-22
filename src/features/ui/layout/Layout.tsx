import { useState, useRef } from "react";
import Head from "next/head";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

import { Header, DesktopNav, ShowSidebarIcon } from "@features/ui";

interface IProps {
  children: JSX.Element;
}

export function Layout({ children }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<{ closeMenu: () => void }>(null);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const checkLoading = () => !!(isFetching || isMutating);

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
      <div className="flex" onClick={() => headerRef.current?.closeMenu()}>
        <DesktopNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <main
          className={`relative h-[calc(100vh-60px)] w-full overflow-auto transition-[margin-left] md:h-[calc(100vh-64px)] ${
            isOpen ? "ml-72" : "ml-0"
          }`}
        >
          {children}
          {checkLoading() && <div className="absolute inset-0 backdrop-blur" />}
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

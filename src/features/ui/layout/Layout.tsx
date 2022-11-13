import Head from "next/head";

import { Header } from "@features/ui";

interface IProps {
  children: JSX.Element;
}

export function Layout({ children }: IProps) {
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
      <Header />
      <main className="min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-68px)]">
        {children}
      </main>
    </>
  );
}

import Head from "next/head";

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

      <main className="min-h-screen">{children}</main>
    </>
  );
}

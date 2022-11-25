import Link from "next/link";
import { useSession } from "next-auth/react";

import { Layout } from "@features/ui";

export default function PageNotFound() {
  const { data: session } = useSession();

  if (session)
    return (
      <Layout>
        <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center text-3xl font-bold uppercase tracking-wider md:h-[calc(100vh-68px)]">
          page not found
        </div>
      </Layout>
    );

  return (
    <main className="mx-4 flex h-screen items-center justify-center ">
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="text-3xl font-bold uppercase">page not found</h1>
        <Link
          href="/"
          className="text-primary transition-colors hover:text-hover-primary"
        >
          Back to sign in page
        </Link>
      </div>
    </main>
  );
}

import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { Signin } from "@features/auth";
import { authOptions } from "@api/auth/[...nextauth]";

export default function Home() {
  return (
    <div className="mx-4 flex h-screen items-center justify-center">
      <Signin />
    </div>
  );
}

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

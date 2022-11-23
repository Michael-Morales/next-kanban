import { useRouter } from "next/router";
import { QueryClient, dehydrate } from "@tanstack/react-query";

import { Empty, useBoards } from "@features/dashboard";
import { Layout } from "@features/ui";
import { getBoards } from "@api/boards";

export default function Dashboard() {
  const router = useRouter();
  const {
    query: { data },
  } = useBoards();

  if (data && !!data.length) {
    return router.push(`/dashboard/${data[0].id}`);
  }

  return (
    <Layout>
      <Empty
        title="There are no boards. Create a new board to get started."
        buttonLabel="create new board"
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  const boards = await queryClient.fetchQuery(["boards"], getBoards);

  if (!!boards.length) {
    return {
      redirect: {
        destination: `/dashboard/${boards[0].id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

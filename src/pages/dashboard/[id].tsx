import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { Layout } from "@features/ui";
import { Column, NewColumn, Empty } from "@features/dashboard";

import data from "../../data.json";

export default function Board({
  columns,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      {!!columns.length ? (
        <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <NewColumn />
        </div>
      ) : (
        <Empty
          title="This board is empty. Create a new column to get started."
          buttonLabel="add new column"
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const board = data.find(({ id }) => query.id === id);

  if (!board) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      columns: board.columns,
    },
  };
}

import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";

import data from "../../data.json";

export default function Board() {
  return (
    <Layout>
      <div className="flex min-h-full gap-x-6 px-4 py-6 md:px-6">
        <Column />
        <Column />
        <Column />
        <NewColumn />
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  if (!!!data.length) {
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

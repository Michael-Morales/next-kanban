import { Empty } from "@features/dashboard";
import { Layout } from "@features/ui";

import data from "../../data.json";

export default function Dashboard() {
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
  if (!!data.length) {
    return {
      redirect: {
        destination: `/dashboard/${data[0].id}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

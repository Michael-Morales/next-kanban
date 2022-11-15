import { Empty } from "@features/dashboard";
import { Layout } from "@features/ui";

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

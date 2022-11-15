import { Layout } from "@features/ui";
import { Column, NewColumn } from "@features/dashboard";

export default function Board() {
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-60px)] gap-x-6 px-4 py-6 md:min-h-[calc(100vh-68px)] md:px-6">
        <Column />
        <Column />
        <Column />
        <NewColumn />
      </div>
    </Layout>
  );
}

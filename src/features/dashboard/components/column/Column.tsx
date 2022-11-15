import { Card } from "../card";

export function Column() {
  return (
    <div className="shrink-0 grow-0 basis-72">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest">
        todo (4)
      </h2>
      <div className="flex flex-col gap-y-5">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}

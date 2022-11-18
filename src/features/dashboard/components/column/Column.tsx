import { Card } from "../card";
import { IColumn, NewTask, ITask, ISubtask } from "@features/dashboard";

interface IProps {
  column: IColumn & { tasks: (ITask & { subtasks: ISubtask[] })[] };
}

export function Column({ column }: IProps) {
  const { id, name, tasks } = column;

  return (
    <div className="shrink-0 grow-0 basis-72">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-widest">
        {name} ({tasks.length})
      </h2>
      <div className="flex flex-col gap-y-5">
        {tasks.map((task) => (
          <Card key={task.id} task={task} />
        ))}
        <NewTask columnId={id} />
      </div>
    </div>
  );
}

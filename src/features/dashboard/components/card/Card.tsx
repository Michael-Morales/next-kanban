import { ITask } from "@features/dashboard";

interface IProps {
  task: ITask;
}

export function Card({ task }: IProps) {
  const { title, subtasks } = task;
  const completedSubtasks = subtasks.filter(({ isCompleted }) => isCompleted);

  return (
    <div className="cursor-pointer rounded-lg bg-white px-4 py-6 shadow-lg shadow-shadow">
      <h3 className="mb-2 font-bold text-black">{title}</h3>
      <p className="text-xs font-bold">
        {completedSubtasks.length} of {subtasks.length} subtasks
      </p>
    </div>
  );
}

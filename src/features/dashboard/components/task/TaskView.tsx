import type { Subtask } from "@prisma/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Checkbox, Button } from "@features/ui";
import { toggleSubtaskSchema, IToggleSubtask } from "@lib/validation";
import { useSubtasks } from "@features/dashboard";

interface IProps {
  description: string | null;
  subtasks?: Subtask[];
  taskId: string;
  completedSubtasks?: string[];
  onClose: () => void;
}

export function TaskView({
  description,
  subtasks,
  completedSubtasks,
  taskId,
  onClose,
}: IProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<IToggleSubtask>({
    defaultValues: { taskId, subtasks: completedSubtasks },
    resolver: zodResolver(toggleSubtaskSchema),
  });
  const { toggleMutation } = useSubtasks(taskId);

  const sortedSubtasks =
    subtasks && [...subtasks].sort((a, b) => +b.isCompleted - +a.isCompleted);

  const onSubmit: SubmitHandler<IToggleSubtask> = async (values) => {
    if (isDirty) {
      const parsedValues = toggleSubtaskSchema.parse(values);
      toggleMutation.mutate(parsedValues);
    }

    onClose();
  };

  return (
    <>
      {description && <p className="text-sm">{description}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!subtasks?.length && (
          <div className="mb-6">
            <h4 className="mb-4 text-xs font-bold dark:text-white">
              Subtasks ({completedSubtasks?.length} of {subtasks.length})
            </h4>
            <div className="flex flex-col gap-y-2">
              {sortedSubtasks?.map(({ id, title }) => (
                <Checkbox
                  key={id}
                  label={title}
                  value={id}
                  register={register("subtasks")}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-y-4">
          <Button
            type="submit"
            disabled={toggleMutation.isLoading}
            loading={toggleMutation.isLoading}
          >
            confirm
          </Button>
        </div>
      </form>
    </>
  );
}

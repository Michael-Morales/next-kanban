import { useForm, SubmitHandler } from "react-hook-form";

import { ISubtask } from "@features/dashboard";
import { Checkbox, Button } from "@features/ui";

interface IProps {
  description?: string;
  subtasks: ISubtask[];
  completedSubtasks: string[];
  onClose: () => void;
}

interface FormValues {
  subtasks: string[];
}

export function TaskView({
  description,
  subtasks,
  completedSubtasks,
  onClose,
}: IProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: { subtasks: completedSubtasks },
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val.subtasks);
    onClose();
  };

  return (
    <>
      {description && <p className="text-sm">{description}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h4 className="mb-4 text-sm font-bold">
            Subtasks ({completedSubtasks.length} of {subtasks.length})
          </h4>
          <div className="flex flex-col gap-y-2">
            {subtasks.map(({ id, title }) => (
              <Checkbox
                key={id}
                label={title}
                value={id}
                register={register("subtasks")}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <Button type="submit">confirm</Button>
          <Button buttonStyle="secondary" onClick={onClose}>
            cancel
          </Button>
        </div>
      </form>
    </>
  );
}

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import { Input, Button, DeletableInput } from "@features/ui";
import { ITask } from "@features/dashboard";

interface IProps {
  onClose?: () => void;
  task: ITask;
}

interface FormValues {
  id: string;
  title: string;
  description: string;
  subtasks: { id: string; title: string }[];
}

export function EditTask({ onClose, task }: IProps) {
  const { id, title, description, subtasks } = task;
  const mappedSubtasks = subtasks.map(({ id, title }) => ({ id, title }));
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      id,
      title,
      description,
      subtasks: mappedSubtasks,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val);
    if (onClose) {
      onClose();
    }
  };

  const checkErrors = () => {
    return !isDirty || !!errors.title || !!errors.subtasks;
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="title"
        register={register("title", { required: true, minLength: 3 })}
        placeholder="e.g. Fix UI bug"
      />
      <Input
        label="description"
        register={register("description")}
        type="textarea"
        placeholder="e.g. The header goes to the background when clicking on the navigation button."
      />
      <fieldset>
        <legend className="mb-2 text-xs font-bold capitalize">subtasks</legend>
        <div className="flex flex-col gap-y-3">
          {fields.map((field, i) => (
            <DeletableInput
              key={field.id}
              register={register(`subtasks.${i}.title` as const, {
                required: true,
              })}
              remove={() => remove(i)}
            />
          ))}
          <Button
            buttonStyle="secondary"
            onClick={() => append({ id: "1", title: "" })}
          >
            add new subtask
          </Button>
        </div>
      </fieldset>
      <Button type="submit" disabled={checkErrors()}>
        save changes
      </Button>
    </form>
  );
}

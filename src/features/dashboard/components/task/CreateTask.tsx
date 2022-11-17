import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import { Input, Button, DeletableInput } from "@features/ui";

interface IProps {
  onClose: () => void;
  columnId: string;
}

interface FormValues {
  title: string;
  description: string;
  columnId: string;
  subtasks: { title: string }[];
}

export function CreateTask({ onClose, columnId }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      columnId,
      subtasks: [{ title: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val);
    onClose();
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
          <Button buttonStyle="secondary" onClick={() => append({ title: "" })}>
            add new subtask
          </Button>
        </div>
      </fieldset>
      <Button type="submit" disabled={checkErrors()}>
        create task
      </Button>
    </form>
  );
}

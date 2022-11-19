import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input, Button, DeletableInput } from "@features/ui";
import { createTaskSchema, ICreateTask } from "@lib/validation";
import axios from "@lib/axios";

interface IProps {
  onClose: () => void;
  columnId: string;
}

export function CreateTask({ onClose, columnId }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<ICreateTask>({
    defaultValues: {
      title: "",
      description: "",
      columnId,
      subtasks: [{ title: "", isCompleted: false }],
    },
    resolver: zodResolver(createTaskSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit: SubmitHandler<ICreateTask> = async (values) => {
    const parsedValues = createTaskSchema.parse(values);
    await axios.post("/tasks", parsedValues);
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
              placeholder="e.g. Changer header CSS rules"
            />
          ))}
          <Button
            buttonStyle="secondary"
            onClick={() => append({ title: "", isCompleted: false })}
          >
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

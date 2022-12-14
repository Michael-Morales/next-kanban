import { useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input, Button, DeletableInput } from "@features/ui";
import { createTaskSchema, ICreateTask } from "@lib/validation";
import { useTasks } from "@features/dashboard";

interface IProps {
  onClose: () => void;
  columnId: string;
  newIdx: number;
}

export function CreateTask({ onClose, columnId, newIdx }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    setFocus,
  } = useForm<ICreateTask>({
    defaultValues: {
      title: "",
      description: "",
      columnId,
      position: newIdx,
      subtasks: [{ title: "", isCompleted: false }],
    },
    resolver: zodResolver(createTaskSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });
  const { createMutation } = useTasks(columnId, onClose);

  const onSubmit: SubmitHandler<ICreateTask> = async (values) => {
    const parsedValues = createTaskSchema.parse(values);
    createMutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return (
      !(
        dirtyFields.title && !!dirtyFields.subtasks?.some(({ title }) => title)
      ) ||
      !!errors.title ||
      !!errors.subtasks ||
      createMutation.isLoading
    );
  };

  useEffect(() => {
    setFocus("title");
  }, [setFocus]);

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="title"
        register={register("title", { required: true, minLength: 3 })}
        placeholder="e.g. Fix UI bug"
        error={errors.title?.message}
      />
      <Input
        label="description"
        register={register("description")}
        type="textarea"
        placeholder="e.g. The header goes to the background when clicking on the navigation button."
      />
      <fieldset>
        <legend className="mb-2 text-xs font-bold capitalize dark:text-white">
          subtasks
        </legend>
        <div className="flex flex-col gap-y-3">
          {fields.map((field, i) => (
            <DeletableInput
              key={field.id}
              register={register(`subtasks.${i}.title` as const, {
                required: true,
              })}
              remove={() => remove(i)}
              placeholder="e.g. Changer header CSS rules"
              error={errors.subtasks?.[i]?.title?.message}
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
      <Button
        type="submit"
        disabled={checkErrors()}
        loading={createMutation.isLoading}
      >
        create task
      </Button>
    </form>
  );
}

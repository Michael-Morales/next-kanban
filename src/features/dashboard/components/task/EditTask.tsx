import type { Task, Subtask } from "@prisma/client";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input, Button, DeletableInput } from "@features/ui";
import { updateTaskSchema, IUpdateTask } from "@lib/validation";
import axios from "@lib/axios";

interface IProps {
  onClose: () => void;
  task: Task & { subtasks: Subtask[] };
}

export function EditTask({ onClose, task }: IProps) {
  const { id, title, description, subtasks } = task;
  const mappedSubtasks = subtasks.map(({ id, title, isCompleted }) => ({
    id,
    title,
    isCompleted,
  }));
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
  } = useForm<IUpdateTask>({
    defaultValues: {
      title,
      description,
      subtasks: mappedSubtasks,
    },
    resolver: zodResolver(updateTaskSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: IUpdateTask) => axios.patch(`/tasks/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      onClose();
    },
  });

  const onSubmit: SubmitHandler<IUpdateTask> = async (values) => {
    const parsedValues = updateTaskSchema.parse(values);
    mutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return (
      !isDirty || !!errors.title || !!errors.subtasks || mutation.isLoading
    );
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
              placeholder="e.g. Change header CSS rules"
            />
          ))}
          <Button
            buttonStyle="secondary"
            onClick={() => append({ id: "", title: "", isCompleted: false })}
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

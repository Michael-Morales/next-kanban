import { useRouter } from "next/router";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Input, DeletableInput, Button } from "@features/ui";
import { createBoardSchema, ICreateBoard } from "@lib/validation";
import axios from "@lib/axios";

interface IProps {
  onClose: () => void;
}

export function CreateBoard({ onClose }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
  } = useForm<ICreateBoard>({
    defaultValues: {
      name: "",
      columns: [{ name: "" }],
    },
    resolver: zodResolver(createBoardSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });
  const mutation = useMutation({
    mutationFn: (values: ICreateBoard) => axios.post("/boards", values),
    onSuccess: ({ data }) => {
      onClose();
      router.push(`/dashboard/${data.boardId}`);
    },
  });

  const onSubmit: SubmitHandler<ICreateBoard> = async (values) => {
    const parsedValues = createBoardSchema.parse(values);
    mutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return (
      !(dirtyFields.name && !!dirtyFields.columns?.some(({ name }) => name)) ||
      !!errors.name ||
      !!errors.columns ||
      mutation.isLoading
    );
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="board name"
        placeholder="e.g. Web Design"
        register={register("name", { required: true, minLength: 3 })}
        error={errors.name?.message}
      />
      <fieldset>
        <legend className="mb-2 text-xs font-bold capitalize">
          board columns
        </legend>
        <div className="flex flex-col gap-y-3">
          {fields.map((field, i) => (
            <DeletableInput
              key={field.id}
              register={register(`columns.${i}.name` as const, {
                required: true,
                minLength: 3,
              })}
              remove={() => remove(i)}
              placeholder="e.g. TODO"
              error={errors.columns?.[i]?.name?.message}
            />
          ))}
          <Button buttonStyle="secondary" onClick={() => append({ name: "" })}>
            add new column
          </Button>
        </div>
      </fieldset>
      <Button
        type="submit"
        disabled={checkErrors()}
        loading={mutation.isLoading}
      >
        create new board
      </Button>
    </form>
  );
}

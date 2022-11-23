import type { Board, Column } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input, DeletableInput, Button } from "@features/ui";
import { updateBoardSchema, IUpdateBoard } from "@lib/validation";
import { useBoard } from "@features/dashboard";

interface IProps {
  onClose: () => void;
  board: Board & { columns: Column[] };
}

export function EditBoard({ onClose, board }: IProps) {
  const router = useRouter();
  const mappedColumns = board.columns.map(({ id, name }) => ({ id, name }));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<IUpdateBoard>({
    defaultValues: { name: board.name, columns: mappedColumns },
    resolver: zodResolver(updateBoardSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });
  const { updateMutation } = useBoard(router.query.id as string, onClose);

  const onSubmit: SubmitHandler<IUpdateBoard> = async (values) => {
    const parsedValues = updateBoardSchema.parse(values);
    updateMutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return (
      !isDirty || !!errors.name || !!errors.columns || updateMutation.isLoading
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
              })}
              remove={() => remove(i)}
              placeholder="e.g. TODO"
              error={errors.columns?.[i]?.name?.message}
            />
          ))}
          <Button
            buttonStyle="secondary"
            onClick={() => append({ id: "", name: "" })}
          >
            add new column
          </Button>
        </div>
      </fieldset>
      <Button
        type="submit"
        disabled={checkErrors()}
        loading={updateMutation.isLoading}
      >
        save changes
      </Button>
    </form>
  );
}

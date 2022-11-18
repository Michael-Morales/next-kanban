import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";

import { Input, DeletableInput, Button } from "@features/ui";
import { IBoard } from "@features/dashboard";

interface IProps {
  onClose: () => void;
  board: IBoard;
}

interface FormValues {
  name: string;
  columns: { id?: string; name: string }[];
}

export function EditBoard({ onClose, board }: IProps) {
  const mappedColumns = board.columns.map(({ id, name }) => ({ id, name }));
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { name: board.name, columns: mappedColumns },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val);
    onClose();
  };

  const checkErrors = () => {
    return !isDirty || !!errors.name || !!errors.columns;
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="board name"
        placeholder="e.g. Web Design"
        register={register("name", { required: true, minLength: 3 })}
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
            />
          ))}
          <Button buttonStyle="secondary" onClick={() => append({ name: "" })}>
            add new column
          </Button>
        </div>
      </fieldset>
      <Button type="submit" disabled={checkErrors()}>
        save changes
      </Button>
    </form>
  );
}

import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "@features/ui";
import { createColumnSchema, ICreateColumn } from "@lib/validation";
import { useColumns } from "@features/dashboard";

interface IProps {
  onClose: () => void;
}

export function CreateColumn({ onClose }: IProps) {
  const router = useRouter();
  const boardId = router.query.id;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ICreateColumn>({
    defaultValues: {
      name: "",
      boardId: boardId as string,
    },
    resolver: zodResolver(createColumnSchema),
  });
  const { createMutation } = useColumns(boardId as string, onClose);

  const onSubmit: SubmitHandler<ICreateColumn> = async (values) => {
    const parsedValues = createColumnSchema.parse(values);
    createMutation.mutate(parsedValues);
  };

  const checkErrors = () => {
    return !isDirty || !!errors.name || createMutation.isLoading;
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="column name"
        register={register("name", { required: true, minLength: 3 })}
        placeholder="e.g. TODO"
        error={errors.name?.message}
      />
      <Button
        type="submit"
        disabled={checkErrors()}
        loading={createMutation.isLoading}
      >
        create column
      </Button>
    </form>
  );
}

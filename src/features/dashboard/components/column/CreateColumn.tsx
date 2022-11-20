import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button, Input } from "@features/ui";
import { createColumnSchema, ICreateColumn } from "@lib/validation";
import axios from "@lib/axios";

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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: ICreateColumn) => axios.post("/columns", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const onSubmit: SubmitHandler<ICreateColumn> = async (values) => {
    const parsedValues = createColumnSchema.parse(values);
    mutation.mutate(parsedValues);
    onClose();
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="column name"
        register={register("name", { required: true, minLength: 3 })}
        placeholder="e.g. TODO"
      />
      <Button
        type="submit"
        disabled={!isDirty || !!errors.name || mutation.isLoading}
      >
        create column
      </Button>
    </form>
  );
}

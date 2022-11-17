import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button, Input } from "@features/ui";

interface IProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  boardId: string;
}

export function CreateColumn({ onClose }: IProps) {
  const router = useRouter();
  const boardId = router.query.id;
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      boardId: boardId as string,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val);
    onClose();
  };

  return (
    <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="title"
        register={register("title", { required: true, minLength: 3 })}
        placeholder="e.g. TODO"
      />
      <Button type="submit" disabled={!isDirty || !!errors.title}>
        create column
      </Button>
    </form>
  );
}

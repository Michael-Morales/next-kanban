import { useForm, SubmitHandler } from "react-hook-form";

import { Button, Input } from "@features/ui";

interface IProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
}

export function CreateColumn({ onClose }: IProps) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: "",
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
        register={register("title")}
        placeholder="e.g. TODO"
      />
      <Button type="submit">create column</Button>
    </form>
  );
}

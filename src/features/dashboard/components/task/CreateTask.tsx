import { useForm, SubmitHandler } from "react-hook-form";

import { Input, Button } from "@features/ui";

interface IProps {
  onClose: () => void;
  columnId: string;
}

interface FormValues {
  title: string;
  description: string;
  columnId: string;
}

export function CreateTask({ onClose, columnId }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "", columnId },
  });

  const onSubmit: SubmitHandler<FormValues> = (val) => {
    console.log(val);
    onClose();
  };

  const checkErrors = () => {
    return !isDirty || !!errors.title;
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
      <Button type="submit" disabled={checkErrors()}>
        create task
      </Button>
    </form>
  );
}

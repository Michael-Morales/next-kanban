import { UseFormRegisterReturn } from "react-hook-form";

import { CloseIcon } from "@features/ui";

interface IProps {
  register: UseFormRegisterReturn;
  remove: () => void;
  placeholder?: string;
  error?: string;
}

export function DeletableInput({
  register,
  remove,
  placeholder,
  error,
}: IProps) {
  return (
    <div className="flex justify-between gap-x-4">
      <input
        className={`${
          error
            ? "border-danger hover:border-danger focus:border-danger"
            : "border-light hover:border-primary focus:border-primary"
        } flex-1 rounded py-2 px-4 text-sm text-black transition-colors placeholder:text-placeholder focus:ring-0 focus:ring-offset-0`}
        type="text"
        {...register}
        placeholder={placeholder}
      />
      <button className="group" onClick={remove}>
        <CloseIcon className="fill-body transition-colors group-hover:fill-danger" />
      </button>
    </div>
  );
}

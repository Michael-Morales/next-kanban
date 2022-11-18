import { UseFormRegisterReturn } from "react-hook-form";

import { CloseIcon } from "@features/ui";

interface IProps {
  register: UseFormRegisterReturn;
  remove: () => void;
  placeholder?: string;
}

export function DeletableInput({ register, remove, placeholder }: IProps) {
  return (
    <div className="flex justify-between gap-x-4">
      <input
        className="flex-1 rounded border-light py-2 px-4 text-sm text-black transition-colors placeholder:text-placeholder hover:border-primary focus:border-primary focus:ring-0 focus:ring-offset-0"
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

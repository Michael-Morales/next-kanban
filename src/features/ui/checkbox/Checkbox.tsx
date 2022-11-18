import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  label: string;
  register: UseFormRegisterReturn;
  value: string;
}

export function Checkbox({ label, register, value }: IProps) {
  return (
    <label className="flex cursor-pointer items-center gap-x-4 rounded bg-light-blue p-3 hover:bg-hover-primary">
      <input
        type="checkbox"
        className="peer rounded-sm border-body text-primary"
        {...register}
        value={value}
      />
      <span className="text-xs font-bold text-black peer-checked:text-body peer-checked:line-through">
        {label}
      </span>
    </label>
  );
}

import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
}

export function Input({ label, type = "text", placeholder, register }: IProps) {
  return (
    <label className="flex flex-col gap-y-2">
      <span className="text-xs font-bold capitalize">{label}</span>
      <input
        type={type}
        className="rounded border-light bg-transparent py-2 px-4 text-sm text-black transition-colors placeholder:text-placeholder hover:border-primary focus:border-primary focus:ring-0 focus:ring-offset-0"
        placeholder={placeholder}
        {...register}
      />
    </label>
  );
}

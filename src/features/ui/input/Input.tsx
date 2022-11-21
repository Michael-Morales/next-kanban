import { UseFormRegisterReturn } from "react-hook-form";

interface IProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

export function Input({
  label,
  type = "text",
  placeholder,
  register,
  error,
}: IProps) {
  return (
    <label className="flex flex-col gap-y-2">
      <div className="flex justify-between">
        <span className="text-xs font-bold capitalize">{label}</span>
        <span className="text-xs font-bold text-danger">{error}</span>
      </div>
      {type === "textarea" ? (
        <textarea
          className={`${
            error
              ? "border-danger hover:border-danger focus:border-danger"
              : "border-light hover:border-primary focus:border-primary"
          } h-28 resize-none rounded bg-transparent py-2 px-4 text-sm text-black transition-colors placeholder:text-placeholder focus:ring-0 focus:ring-offset-0`}
          placeholder={placeholder}
          {...register}
        ></textarea>
      ) : (
        <input
          type={type}
          className={`${
            error
              ? "border-danger hover:border-danger focus:border-danger"
              : "border-light hover:border-primary focus:border-primary"
          } rounded bg-transparent py-2 px-4 text-sm text-black transition-colors placeholder:text-placeholder focus:ring-0 focus:ring-offset-0`}
          placeholder={placeholder}
          {...register}
        />
      )}
    </label>
  );
}

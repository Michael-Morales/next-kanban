import { ButtonHTMLAttributes } from "react";

import { LoadingIcon } from "@features/ui";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | JSX.Element;
  buttonStyle?: string;
  size?: string;
  loading?: boolean;
}

const styles: {
  [key: string]: string;
} = {
  primary:
    "bg-primary text-white hover:bg-hover-primary disabled:bg-secondary disabled:text-white dark:disabled:bg-theme-dark-primary dark:disabled:text-body",
  secondary:
    "bg-secondary text-primary hover:bg-hover-secondary dark:bg-white dark:hover:bg-hover-secondary",
  danger: "bg-danger text-white hover:bg-hover-danger disabled:bg-hover-danger",
  standard: "py-4 px-5 text-base",
  small: "py-2 px-4 text-sm",
};

export function Button({
  type = "button",
  children,
  disabled,
  buttonStyle = "primary",
  size = "standard",
  loading = false,
  onClick,
}: IProps) {
  return (
    <button
      className={`flex flex-1 justify-center rounded-full font-bold capitalize transition-colors ${styles[buttonStyle]} ${styles[size]}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? <LoadingIcon /> : children}
    </button>
  );
}

import { Button } from "@features/ui";

interface IProps {
  title: string;
  buttonLabel: string;
}

export function Empty({ title, buttonLabel }: IProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mx-4 flex flex-col items-center">
        <p className="mb-6 text-center text-lg font-bold">{title}</p>
        <Button>{buttonLabel}</Button>
      </div>
    </div>
  );
}

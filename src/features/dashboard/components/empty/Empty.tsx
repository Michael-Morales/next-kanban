import { Button } from "@features/ui";

interface IProps {
  title: string;
  buttonLabel: string;
}

export function Empty({ title, buttonLabel }: IProps) {
  return (
    <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center md:h-[calc(100vh-68px)]">
      <div className="mx-4 flex flex-col items-center">
        <p className="mb-6 text-center text-lg font-bold">{title}</p>
        <Button>{buttonLabel}</Button>
      </div>
    </div>
  );
}

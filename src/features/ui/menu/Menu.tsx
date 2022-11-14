interface IProps {
  title: string;
  isOpen: boolean;
}

export function Menu({ title, isOpen }: IProps) {
  return (
    <div
      className={`absolute top-20 right-4 -z-10 flex w-48 flex-col items-start gap-y-4 rounded-lg bg-white p-4 text-sm shadow-lg transition-transform md:right-8 ${
        isOpen ? "translate-y-0" : "-translate-y-[2000px]"
      }`}
    >
      <button className="font-bold capitalize">edit {title}</button>
      <button className="font-bold capitalize text-danger">
        delete {title}
      </button>
    </div>
  );
}

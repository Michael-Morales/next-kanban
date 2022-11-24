import { Nav } from "./Nav";

interface IProps {
  isOpen: boolean;
}

export function MobileNav({ isOpen }: IProps) {
  return (
    <div
      className={`absolute top-20 left-14 z-20 max-h-[80vh] w-72 origin-top overflow-y-auto rounded-lg bg-white py-4 px-6 shadow-lg transition dark:bg-theme-dark md:hidden ${
        isOpen ? "scale-y-1" : "scale-y-0"
      }`}
    >
      <Nav />
    </div>
  );
}

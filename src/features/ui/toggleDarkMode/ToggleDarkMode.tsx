import { DarkIcon, LightIcon } from "@features/ui";
import { useDarkMode } from "@hooks/useDarkMode";

export function ToggleDarkMode() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <div className="mb-2 flex w-full items-center justify-center gap-x-6 rounded-md bg-light-blue py-3.5 transition-colors dark:bg-dark">
      <LightIcon />
      <label
        className="relative h-5 w-10 cursor-pointer rounded-xl bg-primary p-[3px] transition-colors hover:bg-hover-primary"
        aria-label="toggle dark mode"
      >
        <input
          type="checkbox"
          className="peer absolute h-0 w-0 opacity-0"
          checked={isDark}
          onChange={() => setIsDark(isDark ? "light" : "dark")}
        />
        <span className="absolute h-3.5 w-3.5 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
      </label>
      <DarkIcon />
    </div>
  );
}

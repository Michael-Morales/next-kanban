import { useState, useEffect } from "react";

export function useDarkMode(): [boolean, (arg: string) => void] {
  const [isBrowser, setIsBrowser] = useState(false);
  const [isDark, setValue] = useState(false);

  const setIsDark = (theme: string) => {
    window.localStorage.setItem("theme", theme);
    setValue(theme === "dark");
  };

  useEffect(() => {
    setIsBrowser(true);
    setValue(() => {
      const theme = window.localStorage.getItem("theme");
      return !!theme && theme === "dark";
    });
  }, []);

  useEffect(() => {
    if (isBrowser) {
      const root = window.document.documentElement;
      root.classList.remove(isDark ? "light" : "dark");
      root.classList.add(isDark ? "dark" : "light");
    }
  }, [isDark, isBrowser]);

  return [isDark, setIsDark];
}

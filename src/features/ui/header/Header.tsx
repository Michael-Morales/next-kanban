import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  MobileNav,
  Menu,
  IMenuHandle,
  Overlay,
  MobileLogo,
  DesktopLogo,
  EllipsisIcon,
  ChevronIcon,
} from "@features/ui";
import { useBoard } from "@features/dashboard";
import { useRouteChange } from "@hooks/useRouteChange";

export const Header = forwardRef<{ closeMenu: () => void }, {}>(function Header(
  _,
  ref
) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<IMenuHandle>(null);
  const {
    query: { data: board },
  } = useBoard(router.query.id as string);

  const handleOpenNav = () => {
    if (menuRef.current?.isOpen) menuRef.current?.close();
    setNavOpen((prev) => !prev);
  };

  const handleMenuOpen = () => {
    if (navOpen) setNavOpen(false);
    menuRef.current?.toggle();
  };

  const handleCloseNav = () => {
    setNavOpen(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      closeMenu: () => {
        if (menuRef.current?.isOpen) menuRef.current?.close();
      },
    }),
    []
  );

  useRouteChange(handleCloseNav);

  return (
    <>
      <Overlay show={navOpen} onDismiss={() => setNavOpen(false)} />
      <MobileNav isOpen={navOpen} />
      <header className="relative z-20 flex items-center justify-between bg-white py-4 px-4 transition-colors dark:bg-theme-dark md:px-8">
        <div className="flex items-center gap-x-4 md:gap-x-14">
          <Link
            href="/dashboard"
            aria-label="home"
            className="text-black dark:text-white"
          >
            <MobileLogo className="md:hidden" />
            <DesktopLogo className="hidden transition-colors md:block" />
          </Link>
          <button
            className="flex items-center gap-x-2 md:hidden"
            onClick={handleOpenNav}
          >
            <h1 className="text-lg font-bold capitalize text-black transition-colors dark:text-white">
              {board ? board.name : "Select a board"}
            </h1>
            <ChevronIcon
              className={`transition-transform ${navOpen ? "-rotate-180" : ""}`}
            />
          </button>
          <h1 className="hidden text-2xl font-bold capitalize text-black transition-colors dark:text-white md:block">
            {board ? board.name : "Select a board"}
          </h1>
        </div>
        <button className="px-2.5" onClick={handleMenuOpen} aria-label="menu">
          <EllipsisIcon />
        </button>
        <Menu ref={menuRef} />
      </header>
    </>
  );
});

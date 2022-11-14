import { useState, useImperativeHandle, forwardRef, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button, MobileNav, Menu } from "@features/ui";

import mobileLogo from "@images/logo-mobile.svg";
import desktopLogo from "@images/logo-dark.svg";
import ellipsisIcon from "@images/icon-vertical-ellipsis.svg";
import addIcon from "@images/icon-add-task-mobile.svg";
import chevronUpIcon from "@images/icon-chevron-up.svg";
import chevronDownIcon from "@images/icon-chevron-down.svg";

export const Header = forwardRef<{ closeMenu: () => void }, {}>(function Header(
  _,
  ref
) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const handleOpenNav = () => {
    if (menuOpen) setMenuOpen(false);
    setNavOpen(!navOpen);
  };

  const handleMenuOpen = () => {
    if (navOpen) setNavOpen(false);
    setMenuOpen(!menuOpen);
  };

  useImperativeHandle(
    ref,
    () => ({
      closeMenu: () => {
        if (menuOpen) setMenuOpen(false);
      },
    }),
    [menuOpen]
  );

  return (
    <>
      {navOpen && (
        <div
          className="absolute inset-0 bg-overlay"
          onClick={() => setNavOpen(false)}
        />
      )}
      <MobileNav isOpen={navOpen} />
      <div className="isolate">
        <header
          ref={headerRef}
          className="relative flex items-center justify-between bg-white py-4 px-4 md:px-8"
        >
          <div className="flex items-center gap-x-4 md:gap-x-14">
            <Link href="/">
              <Image className="md:hidden" src={mobileLogo} alt="" />
              <Image className="hidden md:block" src={desktopLogo} alt="" />
            </Link>
            <button
              className="flex items-center gap-x-2 md:hidden"
              onClick={handleOpenNav}
            >
              <h1 className="text-lg font-bold text-black">
                {router.query.id ? "test" : "Select a board"}
              </h1>
              <Image src={navOpen ? chevronUpIcon : chevronDownIcon} alt="" />
            </button>
            <h1 className="hidden text-2xl font-bold text-black md:block">
              {router.query.id ? "test" : "Select a board"}
            </h1>
          </div>
          <div className="flex items-center gap-x-2">
            <Button size="small">
              <>
                <Image className="md:hidden" src={addIcon} alt="" />
                <span className="hidden md:block">add new task</span>
              </>
            </Button>
            <button className="px-2" onClick={handleMenuOpen}>
              <Image src={ellipsisIcon} alt="" />
            </button>
          </div>
        </header>
        <Menu title="board" isOpen={menuOpen} />
      </div>
    </>
  );
});

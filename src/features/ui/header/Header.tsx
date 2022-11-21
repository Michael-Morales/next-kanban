import type { Board, Column } from "@prisma/client";
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { MobileNav, Menu, IMenuHandle, Overlay } from "@features/ui";
import axios from "@lib/axios";

import mobileLogo from "@images/logo-mobile.svg";
import desktopLogo from "@images/logo-dark.svg";
import ellipsisIcon from "@images/icon-vertical-ellipsis.svg";
import chevronUpIcon from "@images/icon-chevron-up.svg";
import chevronDownIcon from "@images/icon-chevron-down.svg";

export const Header = forwardRef<{ closeMenu: () => void }, {}>(function Header(
  _,
  ref
) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<IMenuHandle>(null);
  const { data: board } = useQuery<Board & { columns: Column[] }>({
    queryKey: ["boards", router.query.id],
    queryFn: async () => {
      const { data } = await axios.get(`/boards/${router.query.id}`);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const handleOpenNav = () => {
    if (menuRef.current?.isOpen) menuRef.current?.close();
    setNavOpen(!navOpen);
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

  useEffect(() => {
    router.events.on("routeChangeComplete", handleCloseNav);

    return () => {
      router.events.off("routeChangeComplete", handleCloseNav);
    };
  }, [router]);

  return (
    <>
      <Overlay show={navOpen} onDismiss={() => setNavOpen(false)} />
      <MobileNav isOpen={navOpen} />
      <header className="relative z-20 flex items-center justify-between bg-white py-4 px-4 md:px-8">
        <div className="flex items-center gap-x-4 md:gap-x-14">
          <Link href="/">
            <Image className="md:hidden" src={mobileLogo} alt="" />
            <Image className="hidden md:block" src={desktopLogo} alt="" />
          </Link>
          <button
            className="flex items-center gap-x-2 md:hidden"
            onClick={handleOpenNav}
          >
            <h1 className="text-lg font-bold capitalize text-black">
              {board ? board.name : "Select a board"}
            </h1>
            <Image src={navOpen ? chevronUpIcon : chevronDownIcon} alt="" />
          </button>
          <h1 className="hidden text-2xl font-bold capitalize text-black md:block">
            {board ? board.name : "Select a board"}
          </h1>
        </div>
        <button className="px-2.5" onClick={handleMenuOpen} disabled={!board}>
          <Image src={ellipsisIcon} alt="" />
        </button>
        {board && <Menu ref={menuRef} board={board} />}
      </header>
    </>
  );
});

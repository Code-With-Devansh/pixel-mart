"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import logoBlack from "$/public/assets/images/logo-black.png";
import logoWhite from "$/public/assets/images/logo-white.png";
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-30 md:ps-68 md:pe-8 ps-5 flex justify-between items-center bg-white dark:bg-card">
      <div className="flex items-center md:hidden">
        <Image
          src={logoWhite.src}
          height={logoWhite.height}
          width={logoWhite.width}
          className="hidden dark:block h-12.5 w-auto"
          alt="logo-white"
        />

        <Image
          src={logoBlack.src}
          height={logoBlack.height}
          width={logoBlack.width}
          className="block dark:hidden h-12.5 w-auto"
          alt="logo-dark"
        />
      </div>
      <div className="md:block hidden">
        <AdminSearch />
      </div>
      <div className="flex items-center gap-2 ">
        <AdminMobileSearch/>
        <ThemeSwitch />
        <UserDropdown />
        <Button
          type="button"
          size="icon"
          className="ms-2 md:hidden"
          onClick={toggleSidebar}
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;

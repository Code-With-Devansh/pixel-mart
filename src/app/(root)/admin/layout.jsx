import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import AppSideBar from "@/components/application/admin/AppSideBar";
import TopBar from "@/components/application/admin/TopBar";
// import ThemeProvider from "@/components/application/admin/ThemeProvider";
import { ThemeProvider } from "next-themes";

const layout = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AppSideBar />

          <main className="md:w-[calc(100vw-16rem)]">
            <div className="pt-17.5 px-5 min-h-[calc(100vh-40px)]">
              <TopBar />
              {children}
            </div>
          </main>
        </SidebarProvider>

        <footer className="border-t h-10 flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
          © 2026 Pixel Mart. All rights reserved.
        </footer>
      </ThemeProvider>
    </>
  );
};

export default layout;

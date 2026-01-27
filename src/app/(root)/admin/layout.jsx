import { SidebarProvider } from "@/components/ui/sidebar"
import React from "react";
import AppSideBar from "@/components/application/admin/AppSideBar";

const layout = ({ children }) => {
  return (
      <SidebarProvider>
        <AppSideBar/>
        <main>{children}</main>
      </SidebarProvider>
  );
};

export default layout;

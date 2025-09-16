import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { AppBreadcrumb } from "@/components/Breadcrumbs/AppBreadcrumb";

export const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1 min-w-0">
            <AppBreadcrumb />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

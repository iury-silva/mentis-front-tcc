import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { AppBreadcrumb } from "@/components/Breadcrumbs/AppBreadcrumb";
import { SearchCommand } from "@/components/Forms/Navbar/SearchCommand";
import { HeaderUser } from "@/components/Sidebar/components/HeaderUser";
import { BottomNavigation } from "@/components/Navigation/BottomNavigation";
import { useAuth } from "@/auth/useAuth";
import { useIsMobile } from "@/hooks/useMobile";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 bg-background border-b border-border/50 sticky top-0 z-20">
          <Link to={user?.role === "admin" ? "/dashboard" : "/dashboard-user"}>
            <img src="/images/logo-mentisV2.png" alt="Logo" className="w-24" />
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <AppBreadcrumb />
            </div>
            <SearchCommand />
            <ThemeToggle />
            {user && <HeaderUser user={user} onLogout={logout} />}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 pb-20">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 bg-transparent border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex items-center md:gap-4 md:flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <AppBreadcrumb />
            </div>
            <SearchCommand />
            <ThemeToggle />
            {user && <HeaderUser user={user} onLogout={logout} />}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

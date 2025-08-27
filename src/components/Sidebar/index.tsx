import { useAuth } from "@/auth/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./components/nav-main";
import { NavUser } from "./components/nav-user";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// import { 
//   HomeIcon,
//   UserIcon,
//   CogIcon,
//   UsersIcon
// } from "lucide-react";

export function AppSidebar() {
  const { user, logout } = useAuth();

  // Defina seus itens da sidebar, com ícones e roles
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Perfil",
      url: "/profile",
      icon: UserIcon,
    },
    {
      title: "Usuários",
      url: "/users",
      icon: UsersIcon,
      items: [
        { title: "Listar Usuários", url: "/users/list" },
        { title: "Adicionar Usuário", url: "/users/add" },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-start px-2 py-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <img src="/fav.ico" alt="Logo" className="h-8 w-8 shrink-0" />
          <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
            Mentis
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} userRole={user?.role} />
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} onLogout={logout} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

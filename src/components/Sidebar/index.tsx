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
  // UserIcon,
  // Cog6ToothIcon,
  // UsersIcon,
  QuestionMarkCircleIcon,
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
      title: "Dashboard Admin",
      url: "/dashboard",
      icon: HomeIcon,
      role: "admin", // só admin vê
    },
    {
      title: "Dashboard User",
      url: "/dashboard-user",
      icon: HomeIcon,
      role: "user", // só user vê
    },
    {
      title: "Questionário",
      url: "/questionnaire",
      icon: QuestionMarkCircleIcon,
      role: "user", // só user vê
    },
    // {
    //   title: "Perfil",
    //   url: "/profile",
    //   icon: UserIcon,
    // },
    // {
    //   title: "Usuários",
    //   url: "/users",
    //   icon: UsersIcon,
    //   items: [
    //     { title: "Listar Usuários", url: "/users/list" },
    //     { title: "Adicionar Usuário", url: "/users/add" },
    //   ],
    // },
    // {
    //   title: "Configurações",
    //   url: "/settings",
    //   icon: Cog6ToothIcon,
    // },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-start px-2 py-4">
        <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100/400 to-slate-200 text-slate-600 font-bold text-lg">
          <img src="/icone-mentisV2.png" alt="Logo" className="w-8 shrink-0" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-bold text-slate-800">Mentis</span>
          <span className="truncate text-xs">
            Saúde Mental
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

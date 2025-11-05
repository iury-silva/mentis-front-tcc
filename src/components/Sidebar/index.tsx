import { useAuth } from "@/auth/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./components/nav-main";
// import { NavUser } from "./components/nav-user";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  QueueListIcon,
  HeartIcon,
  MapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export function AppSidebar() {
  const { user } = useAuth();

  // Defina seus itens da sidebar, com ícones e roles
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
      role: "admin", // só admin vê
    },
    {
      title: "Questionários",
      url: "/questionnaires",
      icon: QueueListIcon,
      role: "admin", // só admin vê
    },
    {
      title: "Dashboard",
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
    {
      title: "Registro de Humor",
      url: "/mood-tracker",
      icon: HeartIcon,
      role: "user", // só user vê
    },
    {
      title: "Mapa de Serviços Próximos",
      url: "/maps-nearby",
      icon: MapIcon,
      role: "user", // só user vê
    },
    {
      title: "Créditos",
      url: "/credits",
      icon: SparklesIcon,
      role: "shared", // ambos veem
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
        <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center h-12 w-12 rounded-lg font-bold text-lg bg-primary/10 text-primary shrink-0 ">
          <img
            src="/images/icone-mentisV2.png"
            alt="Logo"
            className="w-8 shrink-0"
          />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-bold text-foreground">Mentis</span>
          <span className="truncate text-xs">Saúde Mental</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={items} userRole={user?.role} />
      </SidebarContent>

      <SidebarFooter>
        {/* Versão e Copyright */}
        <div className="px-2 py-4 text-center group-data-[collapsible=icon]:px-1">
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-xs text-muted-foreground">Mentis v1.0.0</p>
            <p className="text-xs text-muted-foreground">© 2025 Mentis</p>
          </div>
          <div className="group-data-[collapsible=icon]:block hidden">
            <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto"></div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

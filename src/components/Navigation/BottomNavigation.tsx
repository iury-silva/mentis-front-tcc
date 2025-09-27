import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import {
  HomeIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  UserIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
  HeartIcon as HeartIconSolid,
  UserIcon as UserIconSolid,
  EllipsisHorizontalIcon as EllipsisHorizontalIconSolid,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  role?: "admin" | "user";
  priority?: number; // 1-5: 1 = maior prioridade, 5 = menor prioridade
}

export function BottomNavigation() {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      url: user?.role === "admin" ? "/dashboard" : "/dashboard-user",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      priority: 1, // Maior prioridade
    },
    {
      title: "Questionário",
      url: "/questionnaire",
      icon: QuestionMarkCircleIcon,
      iconSolid: QuestionMarkCircleIconSolid,
      role: "user",
      priority: 2,
    },
    {
      title: "Humor",
      url: "/mood-tracker",
      icon: HeartIcon,
      iconSolid: HeartIconSolid,
      role: "user",
      priority: 3,
    },
    {
      title: "Perfil",
      url: "/settings",
      icon: UserIcon,
      iconSolid: UserIconSolid,
      priority: 4,
    },
    // Exemplo de rotas adicionais que iriam para o menu "Mais"
    // {
    //   title: "Relatórios",
    //   url: "/reports",
    //   icon: ChartBarIcon,
    //   iconSolid: ChartBarIconSolid,
    //   role: "admin",
    //   priority: 5,
    // },
    // {
    //   title: "Notificações",
    //   url: "/notifications",
    //   icon: BellIcon,
    //   iconSolid: BellIconSolid,
    //   priority: 5,
    // },
  ];

  // Filtrar itens baseado no role do usuário
  const filteredItems = navigationItems.filter((item) => {
    if (!item.role) return true; // Item sem role é sempre mostrado
    return item.role === user?.role;
  });

  // Configuração: máximo de itens na navegação inferior
  const MAX_VISIBLE_ITEMS = 4;

  // Ordenar por prioridade e dividir entre principais e extras
  const sortedItems = filteredItems.sort(
    (a, b) => (a.priority || 5) - (b.priority || 5)
  );
  const mainItems = sortedItems.slice(0, MAX_VISIBLE_ITEMS);
  const extraItems = sortedItems.slice(MAX_VISIBLE_ITEMS);

  const isActive = (url: string) => {
    if (url === "/dashboard" || url === "/dashboard-user") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard-user"
      );
    }
    return location.pathname.startsWith(url);
  };

  // Verificar se algum item extra está ativo
  const hasActiveExtraItem = extraItems.some((item) => isActive(item.url));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-49 bg-background border-t border-border/50 backdrop-blur-sm md:hidden">
      <nav className="flex items-center justify-around px-2 py-1">
        {/* Itens principais sempre visíveis */}
        {mainItems.map((item) => {
          const active = isActive(item.url);
          const Icon = active ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-accent-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-6 h-6 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Link>
          );
        })}

        {/* Menu "Mais" se houver itens extras */}
        {extraItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                  hasActiveExtraItem
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-accent-foreground hover:bg-muted"
                )}
              >
                {hasActiveExtraItem ? (
                  <EllipsisHorizontalIconSolid className="w-6 h-6 mb-1 flex-shrink-0" />
                ) : (
                  <EllipsisHorizontalIcon className="w-6 h-6 mb-1 flex-shrink-0" />
                )}
                <span className="text-xs font-medium truncate">Mais</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="mb-2">
              {extraItems.map((item) => {
                const active = isActive(item.url);
                const Icon = active ? item.iconSolid : item.icon;

                return (
                  <DropdownMenuItem key={item.url} asChild>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-2 w-full cursor-pointer",
                        active ? "text-primary bg-primary/10" : ""
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </div>
  );
}

import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: { title: string; url: string }[];
  role?: string; // optional: define role that can see this item
  isActive?: boolean; // optional: if the item is active
}

export function NavMain({
  items,
  userRole,
}: {
  items: NavItem[];
  userRole?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  const isActive = (url?: string) => {
    return url ? location.pathname === url : false;
  };

  const handleNavigation = (url?: string) => {
    if (url) {
      navigate(url);
      // Fechar sidebar no mobile após navegação
      if (isMobile) {
        setOpenMobile(false);
      }
    }
  };

  // Filtrar itens baseado no role do usuário
  const filteredItems = items.filter((item) => {
    if (!item.role) return true;
    if (item.role === "shared") return true; // shared para ambos
    return item.role === userRole;
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mb-1">
        <span className="group-data-[collapsible=icon]:hidden">Menu</span>
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {filteredItems.map((item) => {
          // Se tem subitens, renderizar como Collapsible
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive(item.url)}
                      className="group-data-[collapsible=icon]:tooltip-trigger data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                      {item.icon && (
                        <item.icon className="group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                      )}
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            onClick={() => handleNavigation(subItem.url)}
                            isActive={isActive(subItem.url)}
                            className="cursor-pointer"
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Item simples sem subitens
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={() => handleNavigation(item.url)}
                tooltip={item.title}
                isActive={isActive(item.url)}
                className="group-data-[collapsible=icon]:tooltip-trigger data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                {item.icon && (
                  <item.icon className="group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                )}
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

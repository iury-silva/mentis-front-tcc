/* eslint-disable @typescript-eslint/no-explicit-any */
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"

export function NavUser({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair ({user.name})
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

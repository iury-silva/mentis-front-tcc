import * as React from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";

export function SearchCommand() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const dashboardPath =
    user?.role === "admin" ? "/dashboard" : "/dashboard-user";

  return (
    <>
      {/* Desktop - Input completo */}
      <div className="relative flex-1 max-w-sm hidden sm:block">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          className="pl-8 cursor-pointer w-full"
          onClick={() => setOpen(true)}
          readOnly
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Mobile - Apenas ícone */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden p-2 hover:bg-accent rounded-md transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou busque..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            <CommandItem onSelect={() => handleNavigation(dashboardPath)}>
              <span>Dashboard</span>
            </CommandItem>
            {user?.role === "user" && (
              <>
                <CommandItem
                  onSelect={() => handleNavigation("/questionnaire")}
                >
                  <span>Questionários</span>
                </CommandItem>
                <CommandItem onSelect={() => handleNavigation("/mood-tracker")}>
                  <span>Mood Tracker</span>
                </CommandItem>
              </>
            )}
            <CommandItem onSelect={() => handleNavigation("/settings")}>
              <span>Configurações</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

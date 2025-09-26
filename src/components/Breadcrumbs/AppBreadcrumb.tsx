import { useLocation, Link } from "react-router-dom";
import { useMemo, Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useIsMobile } from "@/hooks/useMobile";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "dashboard-user": "Dashboard",
  questionnaire: "Questionário",
  settings: "Configurações",
  profile: "Perfil",
  users: "Usuários",
  admin: "Admin",
  blocks: "Bloco",
  responses: "Respostas",
};

function prettyLabel(segment: string) {
  const key = segment.toLowerCase();
  if (LABELS[key]) return LABELS[key];

  // Se for um UUID/ID (string longa com hífens), substituir por label genérico
  if (segment.includes("-") && segment.length > 10) {
    return "Item";
  }

  const s = decodeURIComponent(segment).replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AppBreadcrumb() {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  type Crumb = {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  };

  const items: Crumb[] = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const base = user?.role === "user" ? "/dashboard-user" : "/dashboard";

    const crumbs: Crumb[] = parts
      .map((seg, idx) => {
        const href = "/" + parts.slice(0, idx + 1).join("/");
        let label = prettyLabel(seg);

        // Tratamento especial para rotas de questionário
        if (parts[idx - 1] === "blocks" && seg.includes("-")) {
          label = "Responder";
        } else if (parts[idx - 1] === "responses" && seg.includes("-")) {
          label = "Revisar";
        }

        // Evitar links para rotas intermediárias inválidas
        // Se estamos em /questionnaire/blocks ou /questionnaire/responses, remover o segmento
        if (seg === "blocks" || seg === "responses") {
          return null; // Marcar para remoção
        }

        return { href, label };
      })
      .filter(Boolean) as Crumb[]; // Remover itens null

    return [{ href: base, label: "Início", icon: Home }, ...crumbs];
  }, [location.pathname, user?.role]);

  // No mobile, não mostrar breadcrumb
  if (isMobile) {
    return null;
  }

  if (!items?.length) return null;

  const maxVisible = 4;
  const shouldCollapse = items.length > maxVisible;

  const head = shouldCollapse ? [items[0], items[1]] : items.slice(0, -1);
  const tail = shouldCollapse
    ? [items[items.length - 1]]
    : [items[items.length - 1]];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {head.map((c, i) => {
          const isLastHead = i === head.length - 1 && !shouldCollapse;
          return (
            <Fragment key={`head-${c.href}`}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={c.href} className="inline-flex items-center gap-1">
                    {c.icon ? <c.icon className="size-4" /> : null}
                    <span className="truncate max-w-[12ch] sm:max-w-[18ch]">
                      {c.label}
                    </span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLastHead && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}

        {shouldCollapse && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {tail.map((c, i) => {
          const isLast = i === tail.length - 1;
          return (
            <Fragment key={`tail-${c.href}`}>
              {!shouldCollapse && head.length > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="truncate max-w-[20ch] sm:max-w-[32ch]">
                    {c.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={c.href}>{c.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;

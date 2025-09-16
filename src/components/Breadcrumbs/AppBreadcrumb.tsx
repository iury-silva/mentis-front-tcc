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

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "dashboard-user": "Dashboard",
  questionnaire: "Questionário",
  settings: "Configurações",
  profile: "Perfil",
  users: "Usuários",
  admin: "Admin",
};

function prettyLabel(segment: string) {
  const key = segment.toLowerCase();
  if (LABELS[key]) return LABELS[key];
  const s = decodeURIComponent(segment).replace(/[-_]/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function AppBreadcrumb() {
  const location = useLocation();
  const { user } = useAuth();

  type Crumb = {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  };

  const items: Crumb[] = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    // const base =
    //   parts[0] === "dashboard-user" ? "/dashboard-user" : "/dashboard";

    const base = user?.role === "user" ? "/dashboard-user" : "/dashboard";

    const crumbs: Crumb[] = parts.map((seg, idx) => ({
      href: "/" + parts.slice(0, idx + 1).join("/"),
      label: prettyLabel(seg),
    }));
    console.log("Breadcrumb items:", crumbs);
    console.log("Current path:", location.pathname);
    console.log("Base path:", base);
    return [{ href: base, label: "Início", icon: Home }, ...crumbs];
  }, [location.pathname, user?.role]);

  if (!items?.length) return null;

  const maxVisible = 4; // compact when deep
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

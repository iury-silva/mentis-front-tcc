import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Page({ title, description, actions, children }: PageProps) {
  const hasHeader = title || description || actions;
  return (
    <section className="space-y-3 p-4 sm:p-6 lg:p-8">
      {hasHeader && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title && (
              <h1 className="text-xl sm:text-3xl font-semibold tracking-tight truncate">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 sm:justify-end shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      {hasHeader && <Separator />}
      {children}
    </section>
  );
}

export default Page;

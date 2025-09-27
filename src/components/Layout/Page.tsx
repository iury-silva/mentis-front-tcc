import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type PageProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Page({ title, description, actions, children }: PageProps) {
  const hasHeader = title || description || actions;
  return (
    <section className="min-h-full bg-gradient-to-br from-muted/30 to-background dark:from-primary/10 dark:to-muted/20">
      <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {hasHeader && (
          <Card className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50">
            <CardHeader className="">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-2">
                  {title && (
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-primary rounded-full"></div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {title}
                      </CardTitle>
                    </div>
                  )}
                  {description && (
                    <CardDescription className="text-muted-foreground text-base leading-relaxed ml-4">
                      {description}
                    </CardDescription>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center gap-3 sm:justify-end shrink-0">
                    {actions}
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
        )}

        <Card className="bg-card/60 backdrop-blur-sm rounded-2xl shadow-sm border border-border/30">
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Page;

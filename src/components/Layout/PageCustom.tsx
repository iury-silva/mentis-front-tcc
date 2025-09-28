import React, { type ReactNode } from "react";

interface PageCustomProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode; // Botões, loaders, etc
  badge?: ReactNode; // Badge customizado
  children: ReactNode;
}

export const PageCustom: React.FC<PageCustomProps> = ({
  title,
  subtitle,
  icon,
  actions,
  badge,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50 dark:from-primary/10 dark:to-muted/20">
      {/* Header */}
      <header className="bg-card/60 backdrop-blur-sm border-b border-border/50 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="w-10 h-10 flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                <h1 className="sm:text-sm font-bold text-foreground md:text-xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {badge && badge}
              {actions && actions}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

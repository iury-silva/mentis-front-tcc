import React from "react";
import { useAuth } from "../../auth/useAuth";
import { Page } from "@/components/Layout/Page";
import { Button } from "@/components/ui/button";

const DashboardUserPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Page
      title="Meu painel"
      description="Acompanhe suas atividades e próximos passos"
      actions={<Button size="sm" variant="outline">Nova ação</Button>}
    >
      <div className="space-y-3">
        <p>Bem-vindo! Esta é a home autenticada.</p>
        {user && (
          <div className="rounded-lg border p-4 space-y-2">
            <h2 className="font-medium">Informações do usuário</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              <p>ID: {user.id}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            {user.avatar && (
              <div className="flex items-center gap-2">
                <span>Avatar:</span>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            )}
            <details className="text-xs text-muted-foreground">
              <summary>Objeto bruto</summary>
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </Page>
  );
};

export default DashboardUserPage;

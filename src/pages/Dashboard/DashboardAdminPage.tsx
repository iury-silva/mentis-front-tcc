import React from "react";
import { useAuth } from "../../auth/useAuth";
import { Page } from "@/components/Layout/Page";
import { Button } from "@/components/ui/button";

const DashboardAdminPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Page
      title="Dashboard Admin"
      description="Visão geral e atalhos para administração"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Atualizar
          </Button>
          <Button size="sm">Criar</Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p>Bem-vindo! Esta é a home autenticada.</p>
        {user && (
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-2">Informações do usuário</h2>
            <p>ID: {user.id}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        )}
      </div>
    </Page>
  );
};

export default DashboardAdminPage;

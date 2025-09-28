import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { useAuth } from "@/auth/useAuth";
import { PageCustom } from "@/components/Layout/PageCustom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trash2, Shield, User, Mail, Calendar, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteAccountMutation = useMutation({
    mutationFn: () => api.delete(`/users/${user?.id}`),
    onSuccess: () => {
      logout();
      navigate("/login");
    },
    onError: (error) => {
      console.error("Erro ao deletar conta:", error);
    },
  });

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setIsDeleteModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <PageCustom
      title="Configurações"
      subtitle="Gerencie suas preferências e configurações da conta"
      icon={
        <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Perfil
            </CardTitle>
            <CardDescription>
              Suas informações pessoais e dados da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={user.avatar || ""} alt={user.name} />
                <AvatarFallback className="text-base sm:text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-semibold break-words">
                  {user.name}
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm sm:text-base break-all">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize text-sm sm:text-base">
                    {user.role}
                  </span>
                </div>
                {user.createdAt && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      Membro desde {formatDate(user.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Configure suas preferências de uso da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">Notificações por Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre questionários e atualizações
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                >
                  Em breve
                </Button>
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">Tema da Interface</h4>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro ou escuro
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-auto"
                >
                  Em breve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zona de Perigo */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis que afetam permanentemente sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex-1">
                  <h4 className="font-medium text-destructive">
                    Deletar Conta
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Remove permanentemente sua conta e todos os dados
                    associados. Esta ação não pode ser desfeita.
                  </p>
                </div>
                <Dialog
                  open={isDeleteModalOpen}
                  onOpenChange={setIsDeleteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="self-start sm:self-auto whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar Conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmar Exclusão da Conta</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja deletar sua conta? Esta ação é
                        irreversível e todos os seus dados serão permanentemente
                        removidos, incluindo:
                        <div className="list-disc list-inside mt-2 space-y-1">
                          <li>Respostas de questionários</li>
                          <li>Histórico de mood tracking</li>
                          <li>Dados do perfil</li>
                          <li>Configurações personalizadas</li>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteAccountMutation.isPending}
                      >
                        {deleteAccountMutation.isPending
                          ? "Deletando..."
                          : "Deletar Conta"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageCustom>
  );
};

export default SettingsPage;

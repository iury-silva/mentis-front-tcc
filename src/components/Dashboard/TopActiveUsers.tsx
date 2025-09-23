import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, MessageSquare } from "lucide-react";

interface ActiveUser {
  name: string;
  email: string;
  responses: number;
  lastActivity: string;
}

interface TopActiveUsersProps {
  users: ActiveUser[];
  className?: string;
}

export function TopActiveUsers({ users, className = "" }: TopActiveUsersProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Usuários Mais Ativos
        </CardTitle>
        <p className="text-sm text-slate-600">
          Top {users.length} usuários por número de respostas
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum usuário ativo encontrado</p>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user.email}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-red-400 text-white font-medium">
                    {getInitials(user.name)}
                  </Avatar>
                  {index < 3 && (
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">
                    {user.name}
                  </h4>
                  <p className="text-sm text-slate-600 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      Último acesso: {formatDate(user.lastActivity)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {user.responses} respostas
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

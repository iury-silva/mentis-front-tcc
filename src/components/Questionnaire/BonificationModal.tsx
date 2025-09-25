import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Mail, CheckCircle, FileText, Download } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

interface BonificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockTitle?: string;
  benefitType?: string;
}

function BonificationModal({
  isOpen,
  onClose,
  blockTitle,
  benefitType = "Benefício Especial",
}: BonificationModalProps) {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Ícone principal */}
          <div className="relative p-4 rounded-full bg-emerald-50 border-2 border-emerald-200">
            <Gift className="w-12 h-12 text-emerald-600" />
            {/* Ícone de check para sucesso */}
            <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Título */}
          <DialogTitle className="text-xl font-bold text-slate-800">
            🎉 Parabéns pela Conclusão!
          </DialogTitle>

          {/* Descrição */}
          <DialogDescription className="text-slate-600 text-base">
            Você completou com sucesso o questionário
            <br />
            {blockTitle && (
              <span className="font-medium text-slate-800">"{blockTitle}"</span>
            )}
          </DialogDescription>

          {/* Card do benefício */}
          <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-blue-800 text-sm">
                  Benefício Desbloqueado
                </h4>
                <p className="text-blue-700 text-sm">{benefitType}</p>
              </div>
            </div>
          </div>

          {/* Seção principal - envio por email */}
          <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 shadow-sm">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-green-800 text-sm mb-2">
                  📧 Benefício Enviado por Email
                </h4>
                <p className="text-green-700 text-sm mb-3">
                  Seu benefício foi enviado para:
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-green-100 mb-3">
                  <p className="font-medium text-green-900 text-sm">
                    {user?.email || "seu-email@exemplo.com"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">
                      Verifique sua caixa de entrada
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-700">
                      Arquivo anexado pronto para download
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dica importante */}
          <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 text-center">
              💡 <span className="font-medium">Importante:</span> Verifique
              também a pasta de spam ou lixo eletrônico
            </p>
          </div>

          {/* Botão de ação */}
          <div className="flex gap-3 w-full pt-2">
            <Button
              onClick={onClose}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Entendi, vou verificar!
            </Button>
          </div>

          {/* Mensagem de agradecimento */}
          <p className="text-xs text-slate-500 px-4 bg-slate-50 p-3 rounded-lg border">
            Obrigado por participar! Seu feedback é muito importante para nós.
            ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { BonificationModal };

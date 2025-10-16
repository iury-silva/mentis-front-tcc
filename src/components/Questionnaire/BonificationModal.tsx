import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Gift, Mail, CheckCircle, FileText, Download } from "lucide-react";
import { Gift, CheckCircle, FileText } from "lucide-react";
// import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";

interface BonificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockTitle?: string;
  blockId?: string;
  benefitType?: string;
}

function BonificationModal({
  isOpen,
  onClose,
  blockTitle,
  blockId,
  benefitType = "Benefício Especial",
}: BonificationModalProps) {
  // const { user } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate(`/questionnaire/blocks/${blockId}/bonus`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
          {/* Ícone principal */}
          <div className="relative p-3 sm:p-4 rounded-full bg-emerald-50 border-2 border-emerald-200">
            <Gift className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-600" />
            {/* Ícone de check para sucesso */}
            <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 sm:p-1">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Título */}
          <DialogTitle>🎉 Parabéns pela Conclusão!</DialogTitle>

          {/* Descrição */}
          <DialogDescription>
            Você completou com sucesso o questionário
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-1 sm:mt-0" />
            {blockTitle && (
              <span className="font-medium text-foreground block sm:inline mt-1 sm:mt-0">
                "{blockTitle}"
              </span>
            )}
          </DialogDescription>

          {/* Card do benefício */}
          <div className="w-full p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-blue-800 text-xs sm:text-sm">
                  Benefício Desbloqueado
                </h4>
                <p className="text-blue-700 text-xs sm:text-sm">
                  {benefitType}
                </p>
              </div>
            </div>
          </div>

          {/* Seção principal - envio por email */}
          {/* <div className="w-full p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 rounded-xl">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 shadow-sm flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-green-800 text-xs sm:text-sm mb-2">
                  📧 Benefício Enviado por Email
                </h4>
                <p className="text-green-700 text-xs sm:text-sm mb-3">
                  Seu benefício foi enviado para:
                </p>
                <div className="bg-muted/80 p-2 sm:p-3 rounded-lg border border-green-100 dark:border-green-800 mb-3">
                  <p className="font-medium text-green-900 text-xs sm:text-sm break-all">
                    {user?.email || "seu-email@exemplo.com"}
                  </p>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700">
                      Verifique sua caixa de entrada
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                    <span className="text-xs text-green-700">
                      Arquivo anexado pronto para download
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Dica importante */}
          {/* <div className="w-full p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 text-center leading-relaxed">
              💡 <span className="font-medium">Importante:</span> Verifique
              também a pasta de spam ou lixo eletrônico
            </p>
          </div> */}

          {/* Botão de ação */}
          <div className="flex gap-3 w-full pt-2">
            <Button
              onClick={handleClose}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-primary-foreground shadow-lg text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="truncate">Verificar Benefício!</span>
            </Button>
          </div>

          {/* Mensagem de agradecimento */}
          <p className="text-xs text-muted-foreground px-2 sm:px-4 bg-muted p-2 sm:p-3 rounded-lg border text-center leading-relaxed">
            Obrigado por participar! Seu feedback é muito importante para nós.
            ❤️
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { BonificationModal };

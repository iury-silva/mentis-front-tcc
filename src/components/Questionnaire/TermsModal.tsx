import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  termsHtml: string;
  title: string;
}

export function TermsModal({
  isOpen,
  onClose,
  onAccept,
  termsHtml,
  title,
}: TermsModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (agreed) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Termo de Consentimento
            </h2>
            <p className="text-slate-600 mt-1">{title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[400px] w-full">
            <div className="px-6 py-4">
              <div
                className="space-y-4 text-sm leading-relaxed"
                style={{
                  color: "#64748b",
                }}
                dangerouslySetInnerHTML={{
                  __html: termsHtml
                    .replace(
                      /<h2>/g,
                      '<h2 style="font-size: 1.125rem; font-weight: 600; color: #1e293b; margin: 1.5rem 0 0.75rem 0;">'
                    )
                    .replace(
                      /<h1>/g,
                      '<h1 style="font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 1.5rem 0 1rem 0;">'
                    )
                    .replace(
                      /<p>/g,
                      '<p style="margin: 0.75rem 0; color: #64748b; line-height: 1.6;">'
                    )
                    .replace(
                      /<ul>/g,
                      '<ul style="margin: 0.75rem 0; padding-left: 1.5rem; color: #64748b;">'
                    )
                    .replace(
                      /<li>/g,
                      '<li style="margin: 0.25rem 0; color: #64748b;">'
                    )
                    .replace(
                      /<strong>/g,
                      '<strong style="font-weight: 600; color: #1e293b;">'
                    )
                    .replace(
                      /<a /g,
                      '<a style="color: #2563eb; text-decoration: underline;" '
                    ),
                }}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-1"
            />
            <label
              htmlFor="agree-terms"
              className="text-sm text-slate-700 leading-relaxed cursor-pointer"
            >
              Li e concordo com os termos de consentimento livre e esclarecido
              apresentados acima. Compreendo que minha participação é voluntária
              e que posso retirar meu consentimento a qualquer momento.
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Não aceito
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!agreed}
              className="bg-gradient-to-r from-primary to-red-400 hover:from-primary/90 hover:to-red-500"
            >
              Aceito e desejo continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

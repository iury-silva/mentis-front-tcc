import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[95vw] sm:min-w-[70vw] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Termo de Consentimento
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {title}
          </DialogDescription>
        </DialogHeader>
        <div
          className="mt-4 mb-4 sm:space-y-4 text-sm leading-relaxed text-muted-foreground overflow-y-auto max-h-[50vh] pr-2"
          dangerouslySetInnerHTML={{
            __html: termsHtml
              .replace(
                /<h2>/g,
                '<h2 class="text-lg font-semibold text-foreground mt-6 mb-3 first:mt-0">'
              )
              .replace(
                /<h1>/g,
                '<h1 class="text-xl font-bold text-foreground mt-6 mb-4 first:mt-0">'
              )
              .replace(
                /<p>/g,
                '<p class="my-3 text-muted-foreground leading-relaxed">'
              )
              .replace(
                /<ul>/g,
                '<ul class="my-3 pl-6 text-muted-foreground list-disc">'
              )
              .replace(/<li>/g, '<li class="my-1 text-muted-foreground">')
              .replace(
                /<strong>/g,
                '<strong class="font-semibold text-foreground">'
              )
              .replace(
                /<a /g,
                '<a class="text-primary underline hover:text-primary/80" '
              ),
          }}
        />
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Checkbox
              id="agree-terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5 sm:mt-1 flex-shrink-0"
            />
            <label
              htmlFor="agree-terms"
              className="text-sm leading-relaxed cursor-pointer text-foreground"
            >
              Li e concordo com os termos de consentimento livre e esclarecido
              apresentados acima. Compreendo que minha participação é voluntária
              e que posso retirar meu consentimento a qualquer momento.
            </label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Não aceito
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!agreed}
            className="w-full sm:w-auto"
          >
            Aceito e desejo continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

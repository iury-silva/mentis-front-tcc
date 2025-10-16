import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TermsOfService } from "./TermsOfService";
import { PrivacyPolicy } from "./PrivacyPolicy";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Termos e Políticas</DialogTitle>
          <DialogDescription>
            Leia nossos Termos de Uso e Política de Privacidade
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms">Termos de Uso</TabsTrigger>
            <TabsTrigger value="privacy">Política de Privacidade</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] w-full mt-4">
            <TabsContent value="terms" className="mt-0">
              <TermsOfService />
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
              <PrivacyPolicy />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

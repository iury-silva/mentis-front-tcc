import React, { useState } from "react";
import { PageCustom } from "@/components/Layout/PageCustom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, History, Plus, Wrench } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import MoodTracker from "./MoodTracker";
import MoodRecordPage from "./MoodRecordPage";

const MoodTrackerIndex: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"history" | "new">("new");

  return (
    <PageCustom
      title="Registro de Humor"
      subtitle={!isMobile ? "Monitore seu bem-estar emocional" : undefined}
      icon={
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
      }
      actions={
        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
          <Wrench className="w-3 h-3 mr-1" />
          Em desenvolvimento
        </Badge>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "history" | "new")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="new" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Registro
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-0">
          <MoodRecordPage onSuccess={() => setActiveTab("history")} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <MoodTracker />
        </TabsContent>
      </Tabs>
    </PageCustom>
  );
};

export default MoodTrackerIndex;

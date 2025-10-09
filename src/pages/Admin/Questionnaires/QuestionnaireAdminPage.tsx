import { PageCustom } from "@/components/Layout/PageCustom";
import { FilePenLineIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type {
  // Block,
  Questionnaire,
} from "@/pages/Questionnaire/QuestionnairePage";

export default function QuestionnaireAdminPage() {
  const { data, isLoading } = useQuery<Questionnaire[]>({
    queryKey: ["questionnairesAdmin"],
    queryFn: async () => {
      const response = await api.get("/questionnaire");
      return response.data ?? [];
    },
  });
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return (
    <PageCustom
      title="Questionário"
      subtitle="Gerencie os questionários"
      icon={
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
          <FilePenLineIcon className="w-5 h-5 text-primary-foreground" />
        </div>
      }
    >
      <div>
        {data &&
          data.map((questionnaire) => (
            <div key={questionnaire.id}>{questionnaire.title}</div>
          ))}
      </div>
    </PageCustom>
  );
}

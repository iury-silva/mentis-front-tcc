import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/useAuth";
import { Page } from "@/components/Layout/Page";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

interface Block {
  id: string;
  title: string;
  order: number;
  isCompleted: boolean;
  locked?: boolean;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  blocks: Block[];
}

type QuestionnaireResponse = Questionnaire[];

export default function QuestionnairePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);

  const query = useQuery<QuestionnaireResponse>({
    queryKey: ["questionnaire", user?.id],
    queryFn: () => api.get(`/questionnaire?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  const { data } = query;

  useEffect(() => {
    if (data) {
      const mappedBlocks = data.flatMap((questionnaires) => {
        return questionnaires.blocks.map((block) => {
          return {
            ...block,
            locked:
              block.order !== 1 &&
              !questionnaires.blocks.some(
                (b) => b.order === block.order - 1 && b.isCompleted
              ),
          };
        });
      });

      setBlocks(mappedBlocks);
    }
  }, [data]);

  const handleBlockClick = (block: Block) => {
    if (!block.locked) {
      navigate(`/questionnaire/blocks/${block.id}`);
    }
  };

  return (
    <Page
      title="Questionários"
      description="Complete os questionários para acompanhar seu progresso"
    >
      <div className="space-y-8">
        {data?.map((questionnaire) => (
          <div key={questionnaire.id} className="space-y-6">
            <div className="bg-gradient-to-r from-primary/15 to-red-50 rounded-2xl p-6 border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {questionnaire.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {questionnaire.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {questionnaire.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      📅 Criado em:{" "}
                      {new Date(questionnaire.createdAt).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      📊 {blocks.length} blocos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-primary to-red-400 rounded-full"></div>
                Blocos do Questionário
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      block.locked
                        ? "border-slate-200 opacity-60 cursor-not-allowed"
                        : block.isCompleted
                        ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                        : "border-primary/50  hover:shadow-primary/10"
                    }`}
                    onClick={() => handleBlockClick(block)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Ícone hexagonal */}
                      <div className="flex justify-center">
                        <div
                          className={`w-16 h-18 flex items-center justify-center transition-all duration-300 ${
                            block.isCompleted
                              ? "bg-emerald-100 group-hover:bg-emerald-200"
                              : block.locked
                              ? "bg-slate-100"
                              : "bg-primary/15 group-hover:bg-primary/30"
                          }`}
                          style={{
                            clipPath:
                              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          }}
                        >
                          {block.isCompleted ? (
                            <div className="text-emerald-600">
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : block.locked ? (
                            <LockKeyhole size={24} className="text-slate-400" />
                          ) : (
                            <LockKeyholeOpen
                              size={24}
                              className="text-primary"
                            />
                          )}
                        </div>
                      </div>

                      {/* Título do bloco */}
                      <div className="text-center space-y-2">
                        <h4
                          className={`font-semibold text-lg leading-tight ${
                            block.locked ? "text-slate-400" : "text-slate-700"
                          }`}
                        >
                          {block.title.split("– ")[0]}
                        </h4>

                        {/* Badge de status */}
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            block.isCompleted
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : block.locked
                              ? "bg-slate-100 text-slate-500 border border-slate-200"
                              : "bg-primary/15 text-slate-700 border border-primary/50"
                          }`}
                        >
                          {block.isCompleted
                            ? "✓ Concluído"
                            : block.locked
                            ? "🔒 Bloqueado"
                            : "📝 Disponível"}
                        </div>
                      </div>

                      {/* Número do bloco */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            block.isCompleted
                              ? "bg-emerald-500 text-white"
                              : block.locked
                              ? "bg-slate-300 text-slate-600"
                              : "bg-primary text-white"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

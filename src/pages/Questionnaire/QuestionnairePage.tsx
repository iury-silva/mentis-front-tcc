import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useAuth } from "@/auth/useAuth";
import { Page } from "@/components/Layout/Page";
import { LockKeyhole, LockKeyholeOpen, Eye } from "lucide-react";
import { TermsModal } from "@/components/Questionnaire/TermsModal";

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
  terms: string;
  createdAt: string;
  blocks: Block[];
}

type QuestionnaireResponse = Questionnaire[];

export default function QuestionnairePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingBlock, setPendingBlock] = useState<Block | null>(null);
  const [currentQuestionnaire, setCurrentQuestionnaire] =
    useState<Questionnaire | null>(null);

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
    if (block.locked) return;

    // Encontrar o questionário que contém este bloco
    const questionnaire = data?.find((q) =>
      q.blocks.some((b) => b.id === block.id)
    );

    if (!questionnaire) return;

    // Se é o primeiro bloco (order = 1) e tem termos, mostrar o modal
    if (
      block.order === 1 &&
      questionnaire.terms &&
      questionnaire.terms.trim() !== ""
    ) {
      setCurrentQuestionnaire(questionnaire);
      setPendingBlock(block);
      setShowTermsModal(true);
    } else {
      // Navegar diretamente para blocos que não são o primeiro ou não têm termos
      navigate(`/questionnaire/blocks/${block.id}`);
    }
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    if (pendingBlock) {
      navigate(`/questionnaire/blocks/${pendingBlock.id}`);
    }
    setPendingBlock(null);
    setCurrentQuestionnaire(null);
  };

  const handleRejectTerms = () => {
    setShowTermsModal(false);
    setPendingBlock(null);
    setCurrentQuestionnaire(null);
  };

  const handleViewResponses = (blockId: string) => {
    navigate(`/questionnaire/responses/${blockId}`);
  };

  return (
    <>
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
                        📊 {questionnaire.blocks.length} blocos
                      </span>
                      {questionnaire.terms &&
                        questionnaire.terms.trim() !== "" && (
                          <span className="flex items-center gap-1 text-blue-600">
                            📄 Com termo de consentimento
                          </span>
                        )}
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
                  {questionnaire.blocks.map((block) => {
                    const blockData =
                      blocks.find((b) => b.id === block.id) || block;
                    return (
                      <div
                        key={block.id}
                        className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                          blockData.locked
                            ? "border-slate-200 opacity-60"
                            : blockData.isCompleted
                            ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                            : "border-primary/50 hover:shadow-primary/10 cursor-pointer"
                        }`}
                      >
                        <div
                          className="p-6 space-y-4"
                          onClick={() =>
                            !blockData.locked &&
                            !blockData.isCompleted &&
                            handleBlockClick(blockData)
                          }
                        >
                          {/* Ícone hexagonal */}
                          <div className="flex justify-center">
                            <div
                              className={`w-16 h-18 flex items-center justify-center transition-all duration-300 ${
                                blockData.isCompleted
                                  ? "bg-emerald-100 group-hover:bg-emerald-200"
                                  : blockData.locked
                                  ? "bg-slate-100"
                                  : "bg-primary/15 group-hover:bg-primary/30"
                              }`}
                              style={{
                                clipPath:
                                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                              }}
                            >
                              {blockData.isCompleted ? (
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
                              ) : blockData.locked ? (
                                <LockKeyhole
                                  size={24}
                                  className="text-slate-400"
                                />
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
                                blockData.locked
                                  ? "text-slate-400"
                                  : "text-slate-700"
                              }`}
                            >
                              {block.title.split("– ")[0]}
                            </h4>

                            {/* Badge de status */}
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                blockData.isCompleted
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : blockData.locked
                                  ? "bg-slate-100 text-slate-500 border border-slate-200"
                                  : "bg-primary/15 text-slate-700 border border-primary/50"
                              }`}
                            >
                              {blockData.isCompleted
                                ? "✓ Concluído"
                                : blockData.locked
                                ? "🔒 Bloqueado"
                                : block.order === 1 &&
                                  questionnaire.terms &&
                                  questionnaire.terms.trim() !== ""
                                ? "📄 Requer consentimento"
                                : "📝 Disponível"}
                            </div>
                          </div>

                          {/* Número do bloco */}
                          <div className="absolute top-4 right-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                blockData.isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : blockData.locked
                                  ? "bg-slate-300 text-slate-600"
                                  : "bg-primary text-white"
                              }`}
                            >
                              {block.order}
                            </div>
                          </div>
                        </div>

                        {/* Botão para ver respostas (apenas para blocos concluídos) */}
                        {blockData.isCompleted && (
                          <div className="px-6 pb-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewResponses(block.id);
                              }}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              Ver Respostas
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Page>

      {/* Modal de Termos de Consentimento */}
      {showTermsModal && currentQuestionnaire && (
        <TermsModal
          isOpen={showTermsModal}
          onClose={handleRejectTerms}
          onAccept={handleAcceptTerms}
          termsHtml={currentQuestionnaire.terms}
          title={currentQuestionnaire.title}
        />
      )}
    </>
  );
}

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
      title="Questionário"
      description="Responda às perguntas para continuar"
    >
      <section>
        {data?.map((questionnaire) => (
          <section key={questionnaire.id} className="mb-4">
            <header className="mb-2">
              <h2 className="text-lg font-medium text-gray-700">
                {questionnaire.title}
              </h2>
              <p className="text-sm text-gray-600">
                {questionnaire.description}
              </p>
            </header>

            <h3 className="font-medium mb-4 text-gray-700">Blocos</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {blocks.map((block, index) => (
                <li
                  key={block.id}
                  className={`relative group flex flex-col items-center space-y-2 p-3 rounded-3xl transition border ${
                    block.locked
                      ? "border-gray-200 cursor-not-allowed"
                      : "border- cursor-pointer hover:bg-gray-100"
                  }  duration-250`}
                  onClick={() => handleBlockClick(block)}
                >
                  <div
                    className={`w-14 h-16 flex items-center justify-center transition-colors duration-250 bg-gray-100 ${
                      block.locked ? "" : "group-hover:bg-gray-200"
                    }`}
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    }}
                  >
                    {block.locked ? (
                      <LockKeyhole size={22} className="text-gray-400" />
                    ) : (
                      <LockKeyholeOpen size={22} className="text-gray-400" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium text-center transition ${
                      block.locked
                        ? "text-gray-400 blur-[1.3px]"
                        : "text-gray-700"
                    }`}
                  >
                    {block.title.split("– ")[0]}
                  </span>
                  {index < blocks.length - 1 && (
                    <span className="absolute top-1/2 left-full w-6 border-t-2 border-dashed border-gray-300 hidden sm:block"></span>
                  )}
                </li>
              ))}
            </ul>

            <footer className="mt-4">
              <p className="text-sm text-gray-500">
                Criado em:{" "}
                {new Date(questionnaire.createdAt).toLocaleDateString()}
              </p>
            </footer>
          </section>
        ))}
      </section>
    </Page>
  );
}

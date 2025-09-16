import { create } from "zustand";

type QuestionnaireStore = {
  questions: string[];
  addQuestion: (question: string) => void;
};

export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
  questions: [],
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
}));

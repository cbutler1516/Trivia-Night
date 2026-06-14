import {
  categoryOrder,
  triviaQuestions,
  type QuestionCategory,
} from "@/data/questions";

export function getCategoryForQuestionIndex(
  index: number,
): QuestionCategory {
  const clamped = Math.max(0, Math.min(triviaQuestions.length - 1, index));
  return triviaQuestions[clamped].category;
}

export function getQuestionIndicesForCategory(
  category: QuestionCategory,
): number[] {
  return triviaQuestions
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => question.category === category)
    .map(({ index }) => index);
}

export function isLastQuestionInCategory(index: number): boolean {
  const category = getCategoryForQuestionIndex(index);
  const indices = getQuestionIndicesForCategory(category);
  return index === indices[indices.length - 1];
}

export function isFirstQuestionInCategory(index: number): boolean {
  const category = getCategoryForQuestionIndex(index);
  const indices = getQuestionIndicesForCategory(category);
  return index === indices[0];
}

export { categoryOrder };

import { triviaQuestions, type TriviaQuestion } from "@/data/questions";

function normalizeOption(value: string): string {
  return value.trim().toLowerCase();
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isExcludedAnswer(
  candidate: string,
  excluded: Set<string>,
): boolean {
  return excluded.has(normalizeOption(candidate));
}

function collectDecoyAnswers(
  question: TriviaQuestion,
  pool: TriviaQuestion[],
  sameCategoryOnly: boolean,
  excluded: Set<string>,
  existing: string[],
): string[] {
  const decoys = [...existing];

  for (const q of pool) {
    if (q.id === question.id || q.statements) continue;
    if (sameCategoryOnly && q.category !== question.category) continue;

    for (const candidate of [q.answer, ...(q.acceptableAnswers ?? [])]) {
      if (!candidate.trim()) continue;
      if (isExcludedAnswer(candidate, excluded)) continue;
      if (decoys.some((d) => normalizeOption(d) === normalizeOption(candidate))) {
        continue;
      }

      decoys.push(candidate);
      if (decoys.length >= 3) return decoys;
    }
  }

  return decoys;
}

export function buildMultipleChoiceOptions(
  question: TriviaQuestion,
  pool: TriviaQuestion[] = triviaQuestions,
): string[] {
  if (question.choices && question.choices.length > 0) {
    return [...question.choices];
  }

  const correctAnswer = question.answer;
  const excluded = new Set(
    [correctAnswer, ...(question.acceptableAnswers ?? [])].map(normalizeOption),
  );

  let decoys = collectDecoyAnswers(question, pool, true, excluded, []);
  if (decoys.length < 3) {
    decoys = collectDecoyAnswers(question, pool, false, excluded, decoys);
  }

  decoys = decoys.slice(0, 3);

  const options = [correctAnswer];
  for (const decoy of decoys) {
    if (options.some((o) => normalizeOption(o) === normalizeOption(decoy))) {
      continue;
    }
    options.push(decoy);
  }

  return shuffle(options);
}

export function isMultipleChoiceOptionCorrect(
  question: TriviaQuestion,
  option: string,
): boolean {
  const normalized = normalizeOption(option);
  const accepted = [question.answer, ...(question.acceptableAnswers ?? [])].map(
    normalizeOption,
  );
  return accepted.includes(normalized);
}

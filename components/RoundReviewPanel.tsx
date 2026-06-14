"use client";

import { triviaQuestions } from "@/data/questions";
import {
  getMarksForQuestion,
  getSubmissionsForQuestion,
  type GameState,
  type Team,
} from "@/lib/game-store";
import { getQuestionIndicesForCategory } from "@/lib/rounds";
import type { QuestionCategory } from "@/data/questions";

function getCorrectAnswerLabel(
  question: (typeof triviaQuestions)[number],
): string {
  if (question.statements) {
    const index = question.answer.toUpperCase().charCodeAt(0) - 65;
    return `${question.answer}: ${question.statements[index]}`;
  }
  return question.answer;
}

function RoundTeamMarks({
  team,
  labelClass,
  submission,
  mark,
  onCorrect,
  onIncorrect,
}: {
  team: Team;
  labelClass: string;
  submission?: string;
  mark?: "correct" | "incorrect";
  onCorrect: () => void;
  onIncorrect: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className={`arcade-eyebrow text-[10px] ${labelClass}`}>{team === "husbands" ? "Husbands" : "Wives"}</p>
        {mark === "correct" && (
          <span className="text-[10px] font-bold uppercase text-green-300">Correct</span>
        )}
        {mark === "incorrect" && (
          <span className="text-[10px] font-bold uppercase text-red-300">Incorrect</span>
        )}
      </div>
      <p className="mb-2 min-h-[1.25rem] text-xs text-white">
        {submission ?? <span className="italic text-slate-500">No answer</span>}
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={onCorrect}
          className="arcade-btn arcade-btn--green arcade-control-btn py-1.5"
        >
          Correct
        </button>
        <button
          type="button"
          onClick={onIncorrect}
          className="arcade-btn arcade-btn--ghost arcade-control-btn py-1.5 text-red-300"
        >
          Incorrect
        </button>
      </div>
    </div>
  );
}

export function RoundReviewPanel({
  gameState,
  category,
  onMarkCorrect,
  onMarkIncorrect,
}: {
  gameState: GameState;
  category: QuestionCategory;
  onMarkCorrect: (questionIndex: number, team: Team, points: number) => void;
  onMarkIncorrect: (questionIndex: number, team: Team) => void;
}) {
  const indices = getQuestionIndicesForCategory(category);

  return (
    <section className="arcade-card mb-5 p-4">
      <p className="arcade-eyebrow mb-1 text-green-400">Round Answers — {category}</p>
      <p className="mb-4 text-xs text-slate-400">
        Score each team per question. Answers are hidden from players until you discuss them live.
      </p>

      <div className="space-y-4">
        {indices.map((index) => {
          const q = triviaQuestions[index];
          const submissions = getSubmissionsForQuestion(gameState, index);
          const marks = getMarksForQuestion(gameState, index);

          return (
            <div
              key={q.id}
              className="rounded-xl border border-white/10 bg-black/20 p-3.5"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="arcade-badge text-[10px]">Q{index + 1}</span>
                <span className="arcade-badge arcade-badge--blue text-[10px]">
                  {q.points} pts
                </span>
              </div>
              <p className="mb-2 text-sm font-medium text-white">{q.question}</p>
              <p className="arcade-eyebrow mb-3 text-green-400">
                Answer: {getCorrectAnswerLabel(q)}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <RoundTeamMarks
                  team="husbands"
                  labelClass="text-blue-300"
                  submission={submissions.husbands}
                  mark={marks.husbands}
                  onCorrect={() => onMarkCorrect(index, "husbands", q.points)}
                  onIncorrect={() => onMarkIncorrect(index, "husbands")}
                />
                <RoundTeamMarks
                  team="wives"
                  labelClass="text-purple-300"
                  submission={submissions.wives}
                  mark={marks.wives}
                  onCorrect={() => onMarkCorrect(index, "wives", q.points)}
                  onIncorrect={() => onMarkIncorrect(index, "wives")}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

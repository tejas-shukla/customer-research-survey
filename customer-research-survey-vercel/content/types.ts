export type Question = { id: string; title: string; type: "radio" | "multi"; options: string[]; hint?: string; max?: number };

export type MarketContent = {
  /** Stored with every response so the shared sheet can tell markets apart. */
  market: string;
  questions: Question[];
  /** Pre-selected answers (e.g. the "are you based in ..." question). */
  defaultAnswers: Record<string, string>;
  /** Options in the "services_used" question that count as using a rewards scheme. */
  rewardServices: string[];
  /** Completion code from SurveyCircle. Shown on the thank-you screen only to
   *  visitors who arrive with ?src=surveycircle. Leave unset to hide it. */
  surveyCircleCode?: string;
};

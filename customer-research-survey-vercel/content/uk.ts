// UK survey content. Only one market's file is bundled into a build (see next.config.ts).
import type { MarketContent, Question } from "./types";

export const questions: Question[] = [
  { id: "uk_based", title: "Are you currently based in the UK?", type: "radio", options: ["Yes", "No", "Prefer not to say"] },
  {
    id: "holiday_timing", title: "When did you last plan or book a holiday involving at least one overnight stay?",
    type: "radio", options: ["Within the last 3 months", "3–6 months ago", "6–12 months ago", "More than 12 months ago"]
  },
  {
    id: "holiday_challenges", title: "Thinking about your most recent holiday, what did you find most challenging?",
    hint: "Select up to 3.", type: "multi", max: 3,
    options: ["Finding affordable flights or transport", "Finding affordable accommodation", "Managing the overall cost", "Saving enough money", "Finding good deals or discounts", "Working out what I could realistically afford", "Comparing different options", "Finding the time to research and plan", "Nothing in particular", "Other (please specify)"]
  },
  {
    id: "saving_behaviour", title: "What do you currently do to save money or make your spending go further?",
    hint: "Select all that apply.", type: "multi",
    options: ["Compare prices across different websites", "Use discount codes or promotional offers", "Use loyalty points or rewards", "Use cashback services", "Use a credit or debit card with rewards", "Save money regularly towards specific goals", "Use budgeting or savings apps", "Reduce spending in other areas", "I don't currently do anything specific", "Other (please specify)"]
  },
  {
    id: "services_used", title: "Which of the following services or tools have you used in the past 12 months?",
    hint: "Select all that apply.", type: "multi",
    options: ["Nectar or Tesco Clubcard", "TopCashback or Quidco", "Airline or hotel loyalty programmes", "Bank or credit card rewards", "Skyscanner or Google Flights", "Booking.com, Expedia or similar services", "Savings or budgeting apps", "Discount or voucher websites", "Spreadsheets, notes or manual tracking", "None of these", "Other (please specify)"]
  },
  {
    id: "rewards_for_goals", title: "Have you ever used loyalty points, cashback or other rewards to help pay for something significant, such as a holiday, purchase or personal expense?",
    type: "radio", options: ["Yes, regularly", "Yes, once or twice", "No, but I have considered it", "No, I usually use rewards for everyday purchases", "I don't currently collect rewards"]
  },
  {
    id: "rewards_fate", title: "What usually happens to the points, cashback or rewards you accumulate?",
    hint: "Select all that apply.", type: "multi",
    options: ["I use them towards everyday purchases", "I exchange them for vouchers or discounts", "I save them for a larger purchase", "I use them towards travel or holidays", "I withdraw them or transfer them elsewhere", "I often forget about them or leave them unused", "They expire before I use them", "I don't usually accumulate rewards", "Other (please specify)"]
  },
  {
    id: "savings_goals", title: "What are you currently saving towards, if anything?",
    hint: "Select all that apply.", type: "multi",
    options: ["Holidays or travel", "Buying a home or mortgage deposit", "Paying off student loans or other debt", "Emergency savings", "A car or major purchase", "Education or personal development", "General savings", "Other personal goals", "I'm not currently saving towards anything"]
  },
  {
    id: "adoption_motivators", title: "What would make you consider trying a new service or app?",
    hint: "Select up to 3.", type: "multi", max: 3,
    options: ["It helps me save money", "It offers clear and worthwhile benefits", "It is easy and convenient to use", "It helps me achieve a personal goal", "It works alongside services I already use", "It is free to use", "It comes from a company or brand I trust", "It offers something I cannot easily get elsewhere", "Other (please specify)", "Nothing would make me consider trying one"]
  },
  {
    id: "paid_services", title: "In the past 12 months, have you paid for any app, membership or service specifically to save money, earn rewards or help you achieve a financial goal?",
    type: "radio", options: ["Yes", "No", "I have considered paying for one, but haven't", "I'm not sure"]
  },
  {
    id: "early_member", title: "We are exploring a new service designed to help people plan more affordable holidays. Would you be interested in joining as one of our early members, with free membership?",
    type: "radio", options: ["Yes, definitely", "Possibly, I'd like to know more", "Maybe, depending on how it works", "No, not at the moment"]
  }
];

const content: MarketContent = {
  market: "UK",
  questions,
  defaultAnswers: { uk_based: "Yes" },
  rewardServices: ["Nectar or Tesco Clubcard", "TopCashback or Quidco", "Airline or hotel loyalty programmes", "Bank or credit card rewards"],
  // Paste the code SurveyCircle gives you in step 2 of "Post a Survey".
  surveyCircleCode: "N94Q-718M-M43L-LSV6",
};
export default content;

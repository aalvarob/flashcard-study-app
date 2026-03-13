import { describe, it, expect } from "vitest";
import { FLASHCARDS_DATA } from "../data/flashcards";

// Inline the reducer logic for testing (mirrors FlashcardContext.tsx)
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  area: "teologia" | "eclesiologia";
  enabled: boolean;
  correctCount: number;
  wrongCount: number;
  notSureCount: number;
  notRememberCount: number;
}

interface State {
  cards: Flashcard[];
  currentIndex: number;
  sessionCorrect: number;
  sessionWrong: number;
  sessionNotSure: number;
  sessionNotRemember: number;
  isFlipped: boolean;
}

function getEnabledCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter((c) => c.enabled);
}

type Action =
  | { type: "TOGGLE_CARD"; id: string }
  | { type: "MARK_CORRECT"; id: string }
  | { type: "MARK_WRONG"; id: string }
  | { type: "MARK_NOT_SURE"; id: string }
  | { type: "MARK_NOT_REMEMBER"; id: string }
  | { type: "NEXT_CARD" }
  | { type: "PREV_CARD" }
  | { type: "FLIP_CARD" }
  | { type: "RESET_SESSION" }
  | { type: "RESET_ALL_STATS" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_CARD": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, enabled: !c.enabled } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false };
    }
    case "MARK_CORRECT": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, correctCount: c.correctCount + 1, enabled: false } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, sessionCorrect: state.sessionCorrect + 1, isFlipped: false };
    }
    case "MARK_WRONG": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, wrongCount: c.wrongCount + 1 } : c
      );
      return { ...state, cards: updated, sessionWrong: state.sessionWrong + 1 };
    }
    case "MARK_NOT_SURE": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notSureCount: c.notSureCount + 1 } : c
      );
      return { ...state, cards: updated, sessionNotSure: state.sessionNotSure + 1 };
    }
    case "MARK_NOT_REMEMBER": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notRememberCount: c.notRememberCount + 1 } : c
      );
      return { ...state, cards: updated, sessionNotRemember: state.sessionNotRemember + 1 };
    }
    case "NEXT_CARD": {
      const enabled = getEnabledCards(state.cards);
      if (enabled.length === 0) return state;
      const next = (state.currentIndex + 1) % enabled.length;
      return { ...state, currentIndex: next, isFlipped: false };
    }
    case "PREV_CARD": {
      const enabled = getEnabledCards(state.cards);
      if (enabled.length === 0) return state;
      const prev = (state.currentIndex - 1 + enabled.length) % enabled.length;
      return { ...state, currentIndex: prev, isFlipped: false };
    }
    case "FLIP_CARD":
      return { ...state, isFlipped: !state.isFlipped };
    case "RESET_SESSION":
      return { ...state, sessionCorrect: 0, sessionWrong: 0, sessionNotSure: 0, sessionNotRemember: 0, currentIndex: 0, isFlipped: false };
    case "RESET_ALL_STATS": {
      const reset = state.cards.map((c) => ({ ...c, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }));
      return { ...state, cards: reset, sessionCorrect: 0, sessionWrong: 0, sessionNotSure: 0, sessionNotRemember: 0, currentIndex: 0, isFlipped: false };
    }
    default:
      return state;
  }
}

function makeCards(n = 5): Flashcard[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    question: `Q${i}`,
    answer: `A${i}`,
    area: "teologia" as const,
    enabled: true,
    correctCount: 0,
    wrongCount: 0,
    notSureCount: 0,
    notRememberCount: 0,
  }));
}

const baseState: State = {
  cards: makeCards(),
  currentIndex: 0,
  sessionCorrect: 0,
  sessionWrong: 0,
  sessionNotSure: 0,
  sessionNotRemember: 0,
  isFlipped: false,
};

describe("Flashcard data", () => {
  it("should have 79 flashcards total", () => {
    expect(FLASHCARDS_DATA.length).toBe(79);
  });

  it("should have teologia and eclesiologia cards", () => {
    const teologia = FLASHCARDS_DATA.filter((c) => c.area === "teologia");
    const eclesiologia = FLASHCARDS_DATA.filter((c) => c.area === "eclesiologia");
    expect(teologia.length).toBeGreaterThan(0);
    expect(eclesiologia.length).toBeGreaterThan(0);
  });

  it("should have unique IDs", () => {
    const ids = FLASHCARDS_DATA.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all cards should have non-empty question and answer", () => {
    for (const card of FLASHCARDS_DATA) {
      expect(card.question.trim().length).toBeGreaterThan(0);
      expect(card.answer.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Flashcard reducer", () => {
  it("FLIP_CARD toggles isFlipped", () => {
    const s1 = reducer(baseState, { type: "FLIP_CARD" });
    expect(s1.isFlipped).toBe(true);
    const s2 = reducer(s1, { type: "FLIP_CARD" });
    expect(s2.isFlipped).toBe(false);
  });

  it("MARK_CORRECT increments sessionCorrect, card correctCount, and disables the card", () => {
    const state = reducer(baseState, { type: "MARK_CORRECT", id: "c0" });
    expect(state.sessionCorrect).toBe(1);
    const card = state.cards.find((c) => c.id === "c0");
    expect(card!.correctCount).toBe(1);
    expect(card!.enabled).toBe(false);
  });

  it("MARK_CORRECT adjusts currentIndex when card is disabled", () => {
    const atEnd = { ...baseState, currentIndex: 4 };
    const state = reducer(atEnd, { type: "MARK_CORRECT", id: "c4" });
    // After disabling c4 (which was at index 4), enabled cards are c0, c1, c2, c3 (4 cards)
    // currentIndex gets clamped to min(4, max(0, 3)) = min(4, 3) = 3
    expect(state.currentIndex).toBe(3);
    expect(state.isFlipped).toBe(false);
  });

  it("MARK_WRONG increments sessionWrong and card wrongCount", () => {
    const state = reducer(baseState, { type: "MARK_WRONG", id: "c0" });
    expect(state.sessionWrong).toBe(1);
    expect(state.cards.find((c) => c.id === "c0")!.wrongCount).toBe(1);
  });

  it("MARK_NOT_SURE increments sessionNotSure and card notSureCount", () => {
    const state = reducer(baseState, { type: "MARK_NOT_SURE", id: "c0" });
    expect(state.sessionNotSure).toBe(1);
    expect(state.cards.find((c) => c.id === "c0")!.notSureCount).toBe(1);
  });

  it("MARK_NOT_REMEMBER increments sessionNotRemember and card notRememberCount", () => {
    const state = reducer(baseState, { type: "MARK_NOT_REMEMBER", id: "c0" });
    expect(state.sessionNotRemember).toBe(1);
    expect(state.cards.find((c) => c.id === "c0")!.notRememberCount).toBe(1);
  });

  it("NEXT_CARD advances index and resets flip", () => {
    const flipped = { ...baseState, isFlipped: true };
    const state = reducer(flipped, { type: "NEXT_CARD" });
    expect(state.currentIndex).toBe(1);
    expect(state.isFlipped).toBe(false);
  });

  it("NEXT_CARD wraps around at the end", () => {
    const atEnd = { ...baseState, currentIndex: 4 };
    const state = reducer(atEnd, { type: "NEXT_CARD" });
    expect(state.currentIndex).toBe(0);
  });

  it("PREV_CARD wraps around at the beginning", () => {
    const state = reducer(baseState, { type: "PREV_CARD" });
    expect(state.currentIndex).toBe(4);
  });

  it("TOGGLE_CARD disables a card", () => {
    const state = reducer(baseState, { type: "TOGGLE_CARD", id: "c0" });
    expect(state.cards.find((c) => c.id === "c0")!.enabled).toBe(false);
  });

  it("TOGGLE_CARD re-enables a disabled card", () => {
    const s1 = reducer(baseState, { type: "TOGGLE_CARD", id: "c0" });
    const s2 = reducer(s1, { type: "TOGGLE_CARD", id: "c0" });
    expect(s2.cards.find((c) => c.id === "c0")!.enabled).toBe(true);
  });

  it("TOGGLE_CARD adjusts currentIndex if needed", () => {
    const atEnd = { ...baseState, currentIndex: 4 };
    const state = reducer(atEnd, { type: "TOGGLE_CARD", id: "c4" });
    expect(state.currentIndex).toBe(3);
  });

  it("RESET_SESSION resets all session counters and index", () => {
    const dirty = { ...baseState, sessionCorrect: 5, sessionWrong: 3, sessionNotSure: 2, sessionNotRemember: 1, currentIndex: 2, isFlipped: true };
    const state = reducer(dirty, { type: "RESET_SESSION" });
    expect(state.sessionCorrect).toBe(0);
    expect(state.sessionWrong).toBe(0);
    expect(state.sessionNotSure).toBe(0);
    expect(state.sessionNotRemember).toBe(0);
    expect(state.currentIndex).toBe(0);
    expect(state.isFlipped).toBe(false);
  });

  it("RESET_ALL_STATS resets all card counts and session", () => {
    const dirty = {
      ...baseState,
      cards: makeCards().map((c) => ({ ...c, correctCount: 3, wrongCount: 2, notSureCount: 1, notRememberCount: 1 })),
      sessionCorrect: 5,
      sessionWrong: 3,
      sessionNotSure: 2,
      sessionNotRemember: 1,
    };
    const state = reducer(dirty, { type: "RESET_ALL_STATS" });
    expect(state.sessionCorrect).toBe(0);
    expect(state.sessionWrong).toBe(0);
    expect(state.sessionNotSure).toBe(0);
    expect(state.sessionNotRemember).toBe(0);
    state.cards.forEach((c) => {
      expect(c.correctCount).toBe(0);
      expect(c.wrongCount).toBe(0);
      expect(c.notSureCount).toBe(0);
      expect(c.notRememberCount).toBe(0);
    });
  });
});

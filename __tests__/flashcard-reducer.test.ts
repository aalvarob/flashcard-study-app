import { describe, it, expect } from "vitest";
import { FLASHCARDS_DATA } from "../data/flashcards";

// Inline the reducer logic for testing (mirrors FlashcardContext.tsx)
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  area: "escrituras" | "deus" | "homem" | "salvacao" | "igreja" | "batismo" | "pratica" | "historia";
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
      return { ...state, cards: updated, currentIndex: newIndex };
    }

    case "MARK_CORRECT": {
      const updated = state.cards.map((c) =>
        c.id === action.id
          ? { ...c, correctCount: c.correctCount + 1, enabled: false }
          : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return {
        ...state,
        cards: updated,
        currentIndex: newIndex,
        sessionCorrect: state.sessionCorrect + 1,
        isFlipped: false,
      };
    }

    case "MARK_WRONG": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, wrongCount: c.wrongCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return {
        ...state,
        cards: updated,
        currentIndex: newIndex,
        sessionWrong: state.sessionWrong + 1,
        isFlipped: false,
      };
    }

    case "MARK_NOT_SURE": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notSureCount: c.notSureCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return {
        ...state,
        cards: updated,
        currentIndex: newIndex,
        sessionNotSure: state.sessionNotSure + 1,
        isFlipped: false,
      };
    }

    case "MARK_NOT_REMEMBER": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notRememberCount: c.notRememberCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return {
        ...state,
        cards: updated,
        currentIndex: newIndex,
        sessionNotRemember: state.sessionNotRemember + 1,
        isFlipped: false,
      };
    }

    case "NEXT_CARD": {
      const enabledCards = getEnabledCards(state.cards);
      const newIndex = (state.currentIndex + 1) % enabledCards.length;
      return { ...state, currentIndex: newIndex, isFlipped: false };
    }

    case "PREV_CARD": {
      const enabledCards = getEnabledCards(state.cards);
      const newIndex = (state.currentIndex - 1 + enabledCards.length) % enabledCards.length;
      return { ...state, currentIndex: newIndex, isFlipped: false };
    }

    case "FLIP_CARD":
      return { ...state, isFlipped: !state.isFlipped };

    case "RESET_SESSION":
      return {
        ...state,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
        isFlipped: false,
      };

    case "RESET_ALL_STATS": {
      const resetCards = state.cards.map((c) => ({
        ...c,
        correctCount: 0,
        wrongCount: 0,
        notSureCount: 0,
        notRememberCount: 0,
      }));
      return {
        ...state,
        cards: resetCards,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
        isFlipped: false,
      };
    }

    default:
      return state;
  }
}

describe("Flashcard data", () => {
  it("should have 129 flashcards total", () => {
    expect(FLASHCARDS_DATA.length).toBe(129);
  });

  it("should have cards from all areas", () => {
    expect(FLASHCARDS_DATA.length).toBeGreaterThan(0);
    const escrituras = FLASHCARDS_DATA.filter((c) => c.area === "escrituras");
    const deus = FLASHCARDS_DATA.filter((c) => c.area === "deus");
    const homem = FLASHCARDS_DATA.filter((c) => c.area === "homem");
    const salvacao = FLASHCARDS_DATA.filter((c) => c.area === "salvacao");
    const igreja = FLASHCARDS_DATA.filter((c) => c.area === "igreja");
    const batismo = FLASHCARDS_DATA.filter((c) => c.area === "batismo");
    const pratica = FLASHCARDS_DATA.filter((c) => c.area === "pratica");
    const historia = FLASHCARDS_DATA.filter((c) => c.area === "historia");
    expect(escrituras.length).toBeGreaterThan(0);
    expect(deus.length).toBeGreaterThan(0);
    expect(homem.length).toBeGreaterThan(0);
    expect(salvacao.length).toBeGreaterThan(0);
    expect(igreja.length).toBeGreaterThan(0);
    expect(batismo.length).toBeGreaterThan(0);
    expect(pratica.length).toBeGreaterThan(0);
    expect(historia.length).toBeGreaterThan(0);
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
  const initialState: State = {
    cards: FLASHCARDS_DATA.map((c) => ({
      ...c,
      enabled: true,
      correctCount: 0,
      wrongCount: 0,
      notSureCount: 0,
      notRememberCount: 0,
    })),
    currentIndex: 0,
    sessionCorrect: 0,
    sessionWrong: 0,
    sessionNotSure: 0,
    sessionNotRemember: 0,
    isFlipped: false,
  };

  it("should mark card as correct and disable it", () => {
    const cardId = initialState.cards[0].id;
    const newState = reducer(initialState, { type: "MARK_CORRECT", id: cardId });
    const card = newState.cards.find((c) => c.id === cardId);
    expect(card?.correctCount).toBe(1);
    expect(card?.enabled).toBe(false);
    expect(newState.sessionCorrect).toBe(1);
  });

  it("should mark card as wrong", () => {
    const cardId = initialState.cards[0].id;
    const newState = reducer(initialState, { type: "MARK_WRONG", id: cardId });
    const card = newState.cards.find((c) => c.id === cardId);
    expect(card?.wrongCount).toBe(1);
    expect(newState.sessionWrong).toBe(1);
  });

  it("should mark card as not sure", () => {
    const cardId = initialState.cards[0].id;
    const newState = reducer(initialState, { type: "MARK_NOT_SURE", id: cardId });
    const card = newState.cards.find((c) => c.id === cardId);
    expect(card?.notSureCount).toBe(1);
    expect(newState.sessionNotSure).toBe(1);
  });

  it("should mark card as not remember", () => {
    const cardId = initialState.cards[0].id;
    const newState = reducer(initialState, { type: "MARK_NOT_REMEMBER", id: cardId });
    const card = newState.cards.find((c) => c.id === cardId);
    expect(card?.notRememberCount).toBe(1);
    expect(newState.sessionNotRemember).toBe(1);
  });

  it("should toggle card enabled state", () => {
    const cardId = initialState.cards[0].id;
    const newState = reducer(initialState, { type: "TOGGLE_CARD", id: cardId });
    const card = newState.cards.find((c) => c.id === cardId);
    expect(card?.enabled).toBe(false);
  });

  it("should flip card", () => {
    const newState = reducer(initialState, { type: "FLIP_CARD" });
    expect(newState.isFlipped).toBe(true);
  });

  it("should reset session stats", () => {
    let state = reducer(initialState, { type: "MARK_CORRECT", id: initialState.cards[0].id });
    state = reducer(state, { type: "MARK_WRONG", id: initialState.cards[1].id });
    state = reducer(state, { type: "RESET_SESSION" });
    expect(state.sessionCorrect).toBe(0);
    expect(state.sessionWrong).toBe(0);
    expect(state.sessionNotSure).toBe(0);
    expect(state.sessionNotRemember).toBe(0);
  });

  it("should reset all stats", () => {
    let state = reducer(initialState, { type: "MARK_CORRECT", id: initialState.cards[0].id });
    state = reducer(state, { type: "RESET_ALL_STATS" });
    const card = state.cards.find((c) => c.id === initialState.cards[0].id);
    expect(card?.correctCount).toBe(0);
    expect(state.sessionCorrect).toBe(0);
  });
});

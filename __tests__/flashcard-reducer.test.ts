import { describe, it, expect } from "vitest";
import { FLASHCARDS_DATA } from "../data/flashcards";

import { FlashcardArea } from "../data/flashcards";

// Inline the reducer logic for testing (mirrors FlashcardContext.tsx)
interface Flashcard {
  id: string;
  question: string;
  answer: string;
  area: FlashcardArea;
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
        sessionCorrect: state.sessionCorrect + 1,
        currentIndex: newIndex,
      };
    }
    case "MARK_WRONG": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, wrongCount: c.wrongCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = (state.currentIndex + 1) % Math.max(1, enabledCards.length);
      return {
        ...state,
        cards: updated,
        sessionWrong: state.sessionWrong + 1,
        currentIndex: newIndex,
      };
    }
    case "MARK_NOT_SURE": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notSureCount: c.notSureCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = (state.currentIndex + 1) % Math.max(1, enabledCards.length);
      return {
        ...state,
        cards: updated,
        sessionNotSure: state.sessionNotSure + 1,
        currentIndex: newIndex,
      };
    }
    case "MARK_NOT_REMEMBER": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, notRememberCount: c.notRememberCount + 1 } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = (state.currentIndex + 1) % Math.max(1, enabledCards.length);
      return {
        ...state,
        cards: updated,
        sessionNotRemember: state.sessionNotRemember + 1,
        currentIndex: newIndex,
      };
    }
    case "NEXT_CARD": {
      const enabledCards = getEnabledCards(state.cards);
      const newIndex = (state.currentIndex + 1) % Math.max(1, enabledCards.length);
      return { ...state, currentIndex: newIndex, isFlipped: false };
    }
    case "PREV_CARD": {
      const enabledCards = getEnabledCards(state.cards);
      const newIndex = (state.currentIndex - 1 + Math.max(1, enabledCards.length)) % Math.max(1, enabledCards.length);
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
      const updated = state.cards.map((c) => ({
        ...c,
        correctCount: 0,
        wrongCount: 0,
        notSureCount: 0,
        notRememberCount: 0,
      }));
      return {
        ...state,
        cards: updated,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
      };
    }
    default:
      return state;
  }
}

describe("Flashcard reducer", () => {
  it("should toggle card enabled state", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "TOGGLE_CARD", id: "1" });
    expect(newState.cards[0].enabled).toBe(false);
  });

  it("should mark card as correct and disable it", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "MARK_CORRECT", id: "1" });
    expect(newState.cards[0].correctCount).toBe(1);
    expect(newState.cards[0].enabled).toBe(false);
    expect(newState.sessionCorrect).toBe(1);
  });

  it("should mark card as wrong", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "MARK_WRONG", id: "1" });
    expect(newState.cards[0].wrongCount).toBe(1);
    expect(newState.sessionWrong).toBe(1);
  });

  it("should mark card as not sure", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "MARK_NOT_SURE", id: "1" });
    expect(newState.cards[0].notSureCount).toBe(1);
    expect(newState.sessionNotSure).toBe(1);
  });

  it("should mark card as not remember", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "MARK_NOT_REMEMBER", id: "1" });
    expect(newState.cards[0].notRememberCount).toBe(1);
    expect(newState.sessionNotRemember).toBe(1);
  });

  it("should flip card", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionWrong: 0,
      sessionNotSure: 0,
      sessionNotRemember: 0,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "FLIP_CARD" });
    expect(newState.isFlipped).toBe(true);
  });

  it("should reset session stats", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }],
      currentIndex: 0,
      sessionCorrect: 5,
      sessionWrong: 3,
      sessionNotSure: 2,
      sessionNotRemember: 1,
      isFlipped: true,
    };
    const newState = reducer(initialState, { type: "RESET_SESSION" });
    expect(newState.sessionCorrect).toBe(0);
    expect(newState.sessionWrong).toBe(0);
    expect(newState.sessionNotSure).toBe(0);
    expect(newState.sessionNotRemember).toBe(0);
    expect(newState.isFlipped).toBe(false);
  });

  it("should reset all stats", () => {
    const initialState: State = {
      cards: [{ id: "1", question: "Q", answer: "A", area: "escrituras_sagradas", enabled: true, correctCount: 5, wrongCount: 3, notSureCount: 2, notRememberCount: 1 }],
      currentIndex: 0,
      sessionCorrect: 5,
      sessionWrong: 3,
      sessionNotSure: 2,
      sessionNotRemember: 1,
      isFlipped: false,
    };
    const newState = reducer(initialState, { type: "RESET_ALL_STATS" });
    expect(newState.cards[0].correctCount).toBe(0);
    expect(newState.cards[0].wrongCount).toBe(0);
    expect(newState.cards[0].notSureCount).toBe(0);
    expect(newState.cards[0].notRememberCount).toBe(0);
  });
});

describe("Flashcard data", () => {
  it("should have 130 flashcards total", () => {
    expect(FLASHCARDS_DATA.length).toBe(130);
  });

  it("should have cards from all areas", () => {
    expect(FLASHCARDS_DATA.length).toBeGreaterThan(0);
    const areas: FlashcardArea[] = [
      "escrituras_sagradas", "deus_pai", "deus_filho", "deus_espirito_santo",
      "homem", "pecado", "salvacao", "eleicao", "reino_de_deus",
      "igreja", "dia_do_senhor", "ministerio_da_palavra", "liberdade_religiosa",
      "morte", "justos_e_impios", "anjos", "amor_ao_proximo_e_etica",
      "batismo_e_ceia", "evangelismo_e_missoes",
      "educacao_religiosa", "ordem_social", "familia",
      "principios_batistas", "historia_dos_batistas", "estrutura_e_funcionamento_cbb"
    ];
    areas.forEach(area => {
      const areaCards = FLASHCARDS_DATA.filter((c) => c.area === area);
      expect(areaCards.length).toBeGreaterThan(0);
    });
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

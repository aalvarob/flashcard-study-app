import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FLASHCARDS_DATA, FlashcardData, FlashcardArea } from "@/data/flashcards";

const STORAGE_KEY = "@simulado_concilio_state";

export interface Flashcard extends FlashcardData {
  enabled: boolean;
  correctCount: number;
  wrongCount: number;
}

interface FlashcardState {
  cards: Flashcard[];
  currentIndex: number;
  sessionCorrect: number;
  sessionWrong: number;
  isFlipped: boolean;
}

type FlashcardAction =
  | { type: "INIT"; payload: Flashcard[] }
  | { type: "TOGGLE_CARD"; id: string }
  | { type: "MARK_CORRECT"; id: string }
  | { type: "MARK_WRONG"; id: string }
  | { type: "NEXT_CARD" }
  | { type: "PREV_CARD" }
  | { type: "SET_INDEX"; index: number }
  | { type: "FLIP_CARD" }
  | { type: "RESET_FLIP" }
  | { type: "RESET_SESSION" }
  | { type: "RESET_ALL_STATS" };

function getEnabledCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter((c) => c.enabled);
}

function reducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case "INIT":
      return { ...state, cards: action.payload };

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
        c.id === action.id ? { ...c, correctCount: c.correctCount + 1 } : c
      );
      return {
        ...state,
        cards: updated,
        sessionCorrect: state.sessionCorrect + 1,
      };
    }

    case "MARK_WRONG": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, wrongCount: c.wrongCount + 1 } : c
      );
      return {
        ...state,
        cards: updated,
        sessionWrong: state.sessionWrong + 1,
      };
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

    case "SET_INDEX":
      return { ...state, currentIndex: action.index, isFlipped: false };

    case "FLIP_CARD":
      return { ...state, isFlipped: !state.isFlipped };

    case "RESET_FLIP":
      return { ...state, isFlipped: false };

    case "RESET_SESSION":
      return { ...state, sessionCorrect: 0, sessionWrong: 0, currentIndex: 0, isFlipped: false };

    case "RESET_ALL_STATS": {
      const reset = state.cards.map((c) => ({ ...c, correctCount: 0, wrongCount: 0 }));
      return {
        ...state,
        cards: reset,
        sessionCorrect: 0,
        sessionWrong: 0,
        currentIndex: 0,
        isFlipped: false,
      };
    }

    default:
      return state;
  }
}

const initialState: FlashcardState = {
  cards: [],
  currentIndex: 0,
  sessionCorrect: 0,
  sessionWrong: 0,
  isFlipped: false,
};

interface FlashcardContextValue {
  state: FlashcardState;
  enabledCards: Flashcard[];
  currentCard: Flashcard | null;
  toggleCard: (id: string) => void;
  markCorrect: () => void;
  markWrong: () => void;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: () => void;
  resetSession: () => void;
  resetAllStats: () => void;
  getCardsByArea: (area: FlashcardArea) => Flashcard[];
  totalCorrect: number;
  totalWrong: number;
}

const FlashcardContext = createContext<FlashcardContextValue | null>(null);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Flashcard[] = JSON.parse(stored);
          // Merge with fresh data to pick up any new cards
          const merged = FLASHCARDS_DATA.map((fd) => {
            const existing = parsed.find((p) => p.id === fd.id);
            return existing
              ? { ...fd, enabled: existing.enabled, correctCount: existing.correctCount, wrongCount: existing.wrongCount }
              : { ...fd, enabled: true, correctCount: 0, wrongCount: 0 };
          });
          dispatch({ type: "INIT", payload: merged });
        } else {
          const initial = FLASHCARDS_DATA.map((fd) => ({
            ...fd,
            enabled: true,
            correctCount: 0,
            wrongCount: 0,
          }));
          dispatch({ type: "INIT", payload: initial });
        }
      } catch {
        const initial = FLASHCARDS_DATA.map((fd) => ({
          ...fd,
          enabled: true,
          correctCount: 0,
          wrongCount: 0,
        }));
        dispatch({ type: "INIT", payload: initial });
      }
    }
    load();
  }, []);

  // Persist cards state when it changes
  useEffect(() => {
    if (state.cards.length > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.cards)).catch(() => {});
    }
  }, [state.cards]);

  const enabledCards = getEnabledCards(state.cards);
  const currentCard = enabledCards.length > 0 ? enabledCards[state.currentIndex] ?? null : null;

  const toggleCard = useCallback((id: string) => dispatch({ type: "TOGGLE_CARD", id }), []);

  const markCorrect = useCallback(() => {
    if (currentCard) {
      dispatch({ type: "MARK_CORRECT", id: currentCard.id });
    }
  }, [currentCard]);

  const markWrong = useCallback(() => {
    if (currentCard) {
      dispatch({ type: "MARK_WRONG", id: currentCard.id });
    }
  }, [currentCard]);

  const nextCard = useCallback(() => dispatch({ type: "NEXT_CARD" }), []);
  const prevCard = useCallback(() => dispatch({ type: "PREV_CARD" }), []);
  const flipCard = useCallback(() => dispatch({ type: "FLIP_CARD" }), []);
  const resetSession = useCallback(() => dispatch({ type: "RESET_SESSION" }), []);
  const resetAllStats = useCallback(() => dispatch({ type: "RESET_ALL_STATS" }), []);

  const getCardsByArea = useCallback(
    (area: FlashcardArea) => state.cards.filter((c) => c.area === area),
    [state.cards]
  );

  const totalCorrect = state.cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = state.cards.reduce((sum, c) => sum + c.wrongCount, 0);

  return (
    <FlashcardContext.Provider
      value={{
        state,
        enabledCards,
        currentCard,
        toggleCard,
        markCorrect,
        markWrong,
        nextCard,
        prevCard,
        flipCard,
        resetSession,
        resetAllStats,
        getCardsByArea,
        totalCorrect,
        totalWrong,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) throw new Error("useFlashcards must be used within FlashcardProvider");
  return ctx;
}

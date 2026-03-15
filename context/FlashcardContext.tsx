import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FLASHCARDS_DATA, FlashcardData, FlashcardArea } from "@/data/flashcards";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "@simulado_concilio_state";

export interface Flashcard extends FlashcardData {
  enabled: boolean;
  correctCount: number;
  wrongCount: number;
  notSureCount: number;
  notRememberCount: number;
}

interface FlashcardState {
  cards: Flashcard[];
  currentIndex: number;
  sessionCorrect: number;
  sessionWrong: number;
  sessionNotSure: number;
  sessionNotRemember: number;
  isFlipped: boolean;
  loading: boolean;
  error: string | null;
}

type FlashcardAction =
  | { type: "INIT"; payload: Flashcard[] }
  | { type: "TOGGLE_CARD"; id: string }
  | { type: "TOGGLE_ALL_CARDS"; enable: boolean }
  | { type: "TOGGLE_ALL_CARDS_BY_AREA"; enable: boolean; areas: string[] }
  | { type: "MARK_CORRECT"; id: string }
  | { type: "MARK_WRONG"; id: string }
  | { type: "MARK_NOT_SURE"; id: string }
  | { type: "MARK_NOT_REMEMBER"; id: string }
  | { type: "NEXT_CARD" }
  | { type: "PREV_CARD" }
  | { type: "SET_INDEX"; index: number }
  | { type: "FLIP_CARD" }
  | { type: "RESET_FLIP" }
  | { type: "RESET_SESSION" }
  | { type: "RESET_ALL_STATS" }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null };

function getEnabledCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter((c) => c.enabled);
}

function reducer(state: FlashcardState, action: FlashcardAction): FlashcardState {
  switch (action.type) {
    case "INIT":
      return { ...state, cards: action.payload, loading: false };

    case "TOGGLE_CARD": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, enabled: !c.enabled } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false };
    }

    case "TOGGLE_ALL_CARDS": {
      const updated = state.cards.map((c) => ({ ...c, enabled: action.enable }));
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false };
    }

    case "TOGGLE_ALL_CARDS_BY_AREA": {
      const updated = state.cards.map((c) =>
        action.areas.includes(c.area) ? { ...c, enabled: action.enable } : c
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
      return { ...state, sessionCorrect: 0, sessionWrong: 0, sessionNotSure: 0, sessionNotRemember: 0, currentIndex: 0, isFlipped: false };

    case "RESET_ALL_STATS": {
      const reset = state.cards.map((c) => ({ ...c, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 }));
      return {
        ...state,
        cards: reset,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
        currentIndex: 0,
        isFlipped: false,
      };
    }

    case "SET_LOADING":
      return { ...state, loading: action.loading };

    case "SET_ERROR":
      return { ...state, error: action.error };

    default:
      return state;
  }
}

const initialState: FlashcardState = {
  cards: [],
  currentIndex: 0,
  sessionCorrect: 0,
  sessionWrong: 0,
  sessionNotSure: 0,
  sessionNotRemember: 0,
  isFlipped: false,
  loading: true,
  error: null,
};

interface FlashcardContextValue {
  state: FlashcardState;
  enabledCards: Flashcard[];
  currentCard: Flashcard | null;
  toggleCard: (id: string) => void;
  toggleAllCards: (enable: boolean) => void;
  toggleAllCardsByArea: (enable: boolean, areas: string[]) => void;
  markCorrect: () => void;
  markWrong: () => void;
  markNotSure: () => void;
  markNotRemember: () => void;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: () => void;
  resetSession: () => void;
  resetAllStats: () => void;
  getCardsByArea: (area: FlashcardArea) => Flashcard[];
  totalCorrect: number;
  totalWrong: number;
  totalNotSure: number;
  totalNotRemember: number;
  initializeSession: (config: { candidateName: string; area: "all" | FlashcardArea | FlashcardArea[]; cardsPerArea: number }) => void;
}

const FlashcardContext = createContext<FlashcardContextValue | null>(null);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const flashcardsQuery = trpc.flashcards.list.useQuery();

  useEffect(() => {
    async function load() {
      try {
        dispatch({ type: "SET_LOADING", loading: true });

        // Load from API first
        if (flashcardsQuery.data && flashcardsQuery.data.length > 0) {
          const apiCards = flashcardsQuery.data as any[];
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed = stored ? JSON.parse(stored) : {};

          // Merge API data with local stats
          const merged = apiCards.map((apiCard) => {
            const existing = parsed[apiCard.id];
            return {
              id: apiCard.id.toString(),
              question: apiCard.question,
              answer: apiCard.answer,
              area: apiCard.area,
              enabled: existing?.enabled ?? true,
              correctCount: existing?.correctCount ?? 0,
              wrongCount: existing?.wrongCount ?? 0,
              notSureCount: existing?.notSureCount ?? 0,
              notRememberCount: existing?.notRememberCount ?? 0,
            };
          });

          dispatch({ type: "INIT", payload: merged });
        } else {
          // Fallback to local data if API fails
          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed: Flashcard[] = JSON.parse(stored);
            const merged = FLASHCARDS_DATA.map((fd) => {
              const existing = parsed.find((p) => p.id === fd.id);
              return existing
                ? { ...fd, enabled: existing.enabled, correctCount: existing.correctCount, wrongCount: existing.wrongCount, notSureCount: existing.notSureCount ?? 0, notRememberCount: existing.notRememberCount ?? 0 }
                : { ...fd, enabled: true, correctCount: 0, wrongCount: 0, notSureCount: 0, notRememberCount: 0 };
            });
            dispatch({ type: "INIT", payload: merged });
          } else {
            const initial = FLASHCARDS_DATA.map((fd) => ({
              ...fd,
              enabled: true,
              correctCount: 0,
              wrongCount: 0,
              notSureCount: 0,
              notRememberCount: 0,
            }));
            dispatch({ type: "INIT", payload: initial });
          }
        }

        dispatch({ type: "SET_LOADING", loading: false });
      } catch (error) {
        console.error("Error loading flashcards:", error);
        dispatch({ type: "SET_ERROR", error: "Erro ao carregar flashcards" });
        dispatch({ type: "SET_LOADING", loading: false });
      }
    }

    load();
  }, [flashcardsQuery.data]);

  // Save state to AsyncStorage whenever cards change
  useEffect(() => {
    async function save() {
      try {
        const toSave: Record<string, any> = {};
        state.cards.forEach((card) => {
          toSave[card.id] = {
            enabled: card.enabled,
            correctCount: card.correctCount,
            wrongCount: card.wrongCount,
            notSureCount: card.notSureCount,
            notRememberCount: card.notRememberCount,
          };
        });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (error) {
        console.error("Error saving flashcards:", error);
      }
    }

    save();
  }, [state.cards]);

  const toggleCard = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_CARD", id });
  }, []);

  const toggleAllCards = useCallback((enable: boolean) => {
    dispatch({ type: "TOGGLE_ALL_CARDS", enable });
  }, []);

  const toggleAllCardsByArea = useCallback((enable: boolean, areas: string[]) => {
    dispatch({ type: "TOGGLE_ALL_CARDS_BY_AREA", enable, areas });
  }, []);

  const enabledCards = getEnabledCards(state.cards);
  const currentCard = enabledCards[state.currentIndex] || null;

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

  const markNotSure = useCallback(() => {
    if (currentCard) {
      dispatch({ type: "MARK_NOT_SURE", id: currentCard.id });
    }
  }, [currentCard]);

  const markNotRemember = useCallback(() => {
    if (currentCard) {
      dispatch({ type: "MARK_NOT_REMEMBER", id: currentCard.id });
    }
  }, [currentCard]);

  const nextCard = useCallback(() => {
    dispatch({ type: "NEXT_CARD" });
  }, []);

  const prevCard = useCallback(() => {
    dispatch({ type: "PREV_CARD" });
  }, []);

  const flipCard = useCallback(() => {
    dispatch({ type: "FLIP_CARD" });
  }, []);

  const resetSession = useCallback(() => {
    dispatch({ type: "RESET_SESSION" });
  }, []);

  const resetAllStats = useCallback(() => {
    dispatch({ type: "RESET_ALL_STATS" });
  }, []);

  const getCardsByArea = useCallback(
    (area: FlashcardArea) => {
      return state.cards.filter((c) => c.area === area);
    },
    [state.cards],
  );

  const totalCorrect = state.cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = state.cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const totalNotSure = state.cards.reduce((sum, c) => sum + c.notSureCount, 0);
  const totalNotRemember = state.cards.reduce((sum, c) => sum + c.notRememberCount, 0);

  const initializeSession = useCallback((config: { candidateName: string; area: "all" | FlashcardArea | FlashcardArea[]; cardsPerArea: number }) => {
    // Implementation for session initialization
    console.log("Session initialized:", config);
  }, []);

  const value: FlashcardContextValue = {
    state,
    enabledCards,
    currentCard,
    toggleCard,
    toggleAllCards,
    toggleAllCardsByArea,
    markCorrect,
    markWrong,
    markNotSure,
    markNotRemember,
    nextCard,
    prevCard,
    flipCard,
    resetSession,
    resetAllStats,
    getCardsByArea,
    totalCorrect,
    totalWrong,
    totalNotSure,
    totalNotRemember,
    initializeSession,
  };

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within FlashcardProvider");
  }
  return context;
}

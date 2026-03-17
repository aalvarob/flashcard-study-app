import React, {
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
  sessionTotal: number;
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
    case "INIT": {
      const enabledCount = action.payload.filter(c => c.enabled).length;
      return { ...state, cards: action.payload, loading: false, sessionTotal: enabledCount };
    }

    case "TOGGLE_CARD": {
      const updated = state.cards.map((c) =>
        c.id === action.id ? { ...c, enabled: !c.enabled } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false, sessionTotal: enabledCards.length };
    }

    case "TOGGLE_ALL_CARDS": {
      const updated = state.cards.map((c) => ({ ...c, enabled: action.enable }));
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false, sessionTotal: enabledCards.length };
    }

    case "TOGGLE_ALL_CARDS_BY_AREA": {
      const updated = state.cards.map((c) =>
        action.areas.includes(c.area) ? { ...c, enabled: action.enable } : c
      );
      const enabledCards = getEnabledCards(updated);
      const newIndex = Math.min(state.currentIndex, Math.max(0, enabledCards.length - 1));
      return { ...state, cards: updated, currentIndex: newIndex, isFlipped: false, sessionTotal: enabledCards.length };
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

    case "SET_INDEX": {
      const enabled = getEnabledCards(state.cards);
      if (enabled.length === 0) return state;
      const index = Math.min(action.index, enabled.length - 1);
      return { ...state, currentIndex: index, isFlipped: false };
    }

    case "FLIP_CARD": {
      return { ...state, isFlipped: true };
    }

    case "RESET_FLIP": {
      return { ...state, isFlipped: false };
    }

    case "RESET_SESSION": {
      return {
        ...state,
        currentIndex: 0,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
        isFlipped: false,
      };
    }

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
        currentIndex: 0,
        sessionCorrect: 0,
        sessionWrong: 0,
        sessionNotSure: 0,
        sessionNotRemember: 0,
        isFlipped: false,
      };
    }

    case "SET_LOADING": {
      return { ...state, loading: action.loading };
    }

    case "SET_ERROR": {
      return { ...state, error: action.error };
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
  sessionNotSure: 0,
  sessionNotRemember: 0,
  isFlipped: false,
  loading: true,
  error: null,
  sessionTotal: 0,
};

interface FlashcardContextValue {
  state: FlashcardState;
  enabledCards: Flashcard[];
  currentCard: Flashcard | null;
  toggleCard: (id: string) => void;
  toggleAllCards: (enable: boolean) => void;
  toggleAllCardsByArea: (enable: boolean, areas: string[]) => void;
  markCorrect: (id: string) => void;
  markWrong: (id: string) => void;
  markNotSure: (id: string) => void;
  markNotRemember: (id: string) => void;
  nextCard: () => void;
  prevCard: () => void;
  setIndex: (index: number) => void;
  flipCard: () => void;
  resetFlip: () => void;
  resetSession: () => void;
  resetAllStats: () => void;
  initializeSession: (config: { candidateName: string; area: "all" | FlashcardArea | FlashcardArea[]; cardsPerArea: number }) => void;
}

const FlashcardContext = createContext<FlashcardContextValue | undefined>(
  undefined
);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: "SET_LOADING", loading: true });
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: "INIT", payload: parsed.cards });
        } else {
          const initialCards: Flashcard[] = FLASHCARDS_DATA.map((card) => ({
            ...card,
            enabled: true,
            correctCount: 0,
            wrongCount: 0,
            notSureCount: 0,
            notRememberCount: 0,
          }));
          dispatch({ type: "INIT", payload: initialCards });
        }
      } catch (error) {
        console.error("Failed to load flashcards:", error);
        dispatch({
          type: "SET_ERROR",
          error: "Failed to load flashcards",
        });
        const initialCards: Flashcard[] = FLASHCARDS_DATA.map((card) => ({
          ...card,
          enabled: true,
          correctCount: 0,
          wrongCount: 0,
          notSureCount: 0,
          notRememberCount: 0,
        }));
        dispatch({ type: "INIT", payload: initialCards });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ cards: state.cards }));
      } catch (error) {
        console.error("Failed to save flashcards:", error);
      }
    };

    if (!state.loading) {
      saveData();
    }
  }, [state.cards, state.loading]);

  const enabledCards = getEnabledCards(state.cards);
  const currentCard = enabledCards[state.currentIndex] || null;

  const toggleCard = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_CARD", id }),
    []
  );

  const toggleAllCards = useCallback(
    (enable: boolean) => dispatch({ type: "TOGGLE_ALL_CARDS", enable }),
    []
  );

  const toggleAllCardsByArea = useCallback(
    (enable: boolean, areas: string[]) =>
      dispatch({ type: "TOGGLE_ALL_CARDS_BY_AREA", enable, areas }),
    []
  );

  const markCorrect = useCallback(
    (id: string) => dispatch({ type: "MARK_CORRECT", id }),
    []
  );

  const markWrong = useCallback(
    (id: string) => dispatch({ type: "MARK_WRONG", id }),
    []
  );

  const markNotSure = useCallback(
    (id: string) => dispatch({ type: "MARK_NOT_SURE", id }),
    []
  );

  const markNotRemember = useCallback(
    (id: string) => dispatch({ type: "MARK_NOT_REMEMBER", id }),
    []
  );

  const nextCard = useCallback(() => dispatch({ type: "NEXT_CARD" }), []);
  const prevCard = useCallback(() => dispatch({ type: "PREV_CARD" }), []);
  const setIndex = useCallback(
    (index: number) => dispatch({ type: "SET_INDEX", index }),
    []
  );
  const flipCard = useCallback(() => dispatch({ type: "FLIP_CARD" }), []);
  const resetFlip = useCallback(() => dispatch({ type: "RESET_FLIP" }), []);
  const resetSession = useCallback(
    () => dispatch({ type: "RESET_SESSION" }),
    []
  );
  const resetAllStats = useCallback(
    () => dispatch({ type: "RESET_ALL_STATS" }),
    []
  );

  const totalCorrect = state.cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = state.cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const totalNotSure = state.cards.reduce((sum, c) => sum + c.notSureCount, 0);
  const totalNotRemember = state.cards.reduce((sum, c) => sum + c.notRememberCount, 0);

  const initializeSession = useCallback((config: { candidateName: string; area: "all" | FlashcardArea | FlashcardArea[]; cardsPerArea: number }) => {
    console.log("Session initialized:", config);
    
    // Determine which areas to enable
    const areasToEnable = config.area === "all" 
      ? Array.from(new Set(state.cards.map(c => c.area)))
      : Array.isArray(config.area) 
        ? config.area 
        : [config.area];
    
    // Get all cards from selected areas
    const cardsFromSelectedAreas = state.cards.filter(c => areasToEnable.includes(c.area as FlashcardArea));
    
    // Shuffle and select cardsPerArea cards randomly
    const shuffled = [...cardsFromSelectedAreas].sort(() => Math.random() - 0.5);
    const selectedCardIds = new Set(shuffled.slice(0, config.cardsPerArea).map(c => c.id));
    
    // Enable only the selected cards
    const updated = state.cards.map(card => {
      return { ...card, enabled: selectedCardIds.has(card.id) };
    });
    
    const enabledCount = updated.filter(c => c.enabled).length;
    console.log("initializeSession - Cards enabled:", enabledCount, "Config:", config);
    dispatch({ type: "INIT", payload: updated });
  }, [state.cards])

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
    setIndex,
    flipCard,
    resetFlip,
    resetSession,
    resetAllStats,
    initializeSession,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
}

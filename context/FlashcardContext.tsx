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

  useEffect(() => {
    async function load() {
      try {
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
      } catch {
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
    load();
  }, []);

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

  const nextCard = useCallback(() => dispatch({ type: "NEXT_CARD" }), []);
  const prevCard = useCallback(() => dispatch({ type: "PREV_CARD" }), []);
  const flipCard = useCallback(() => dispatch({ type: "FLIP_CARD" }), []);
  const resetSession = useCallback(() => dispatch({ type: "RESET_SESSION" }), []);
  const resetAllStats = useCallback(() => dispatch({ type: "RESET_ALL_STATS" }), []);

  const toggleAllCardsByArea = useCallback(
    (enable: boolean, areas: string[]) => {
      dispatch({ type: "TOGGLE_ALL_CARDS_BY_AREA", enable, areas });
    },
    []
  );

  const toggleAllCards = useCallback(
    (enable: boolean) => {
      dispatch({ type: "TOGGLE_ALL_CARDS", enable });
    },
    []
  );

  const getCardsByArea = useCallback(
    (area: FlashcardArea) => state.cards.filter((c) => c.area === area),
    [state.cards]
  );

  const totalCorrect = state.cards.reduce((sum, c) => sum + c.correctCount, 0);
  const totalWrong = state.cards.reduce((sum, c) => sum + c.wrongCount, 0);
  const totalNotSure = state.cards.reduce((sum, c) => sum + c.notSureCount, 0);
  const totalNotRemember = state.cards.reduce((sum, c) => sum + c.notRememberCount, 0);

  const initializeSession = useCallback(
    (config: { candidateName: string; area: "all" | FlashcardArea | FlashcardArea[]; cardsPerArea: number }) => {
      let selectedIds: Set<string>;
      
      if (config.area === "all") {
        // Selecionar um total de cardsPerArea cards distribuido entre TODAS as areas
        selectedIds = new Set();
        let cardsAdded = 0;
        const allAreas = Array.from(new Set(state.cards.map(c => c.area)));
        
        // Tentar distribuir cards entre areas
        let areaIndex = 0;
        while (cardsAdded < config.cardsPerArea && allAreas.length > 0) {
          const area = allAreas[areaIndex % allAreas.length];
          const areaCards = state.cards.filter((c) => c.area === area && !selectedIds.has(c.id));
          
          if (areaCards.length > 0) {
            selectedIds.add(areaCards[0].id);
            cardsAdded++;
          }
          areaIndex++;
        }
        
        // Se ainda nao atingiu o total, pegar mais cards de qualquer area
        if (cardsAdded < config.cardsPerArea) {
          for (const card of state.cards) {
            if (!selectedIds.has(card.id)) {
              selectedIds.add(card.id);
              cardsAdded++;
              if (cardsAdded >= config.cardsPerArea) break;
            }
          }
        }
      } else if (Array.isArray(config.area)) {
        // Múltiplas áreas selecionadas - usar cardsPerArea
        selectedIds = new Set();
        config.area.forEach(area => {
          const areaCards = state.cards.filter((c) => c.area === area).slice(0, config.cardsPerArea);
          areaCards.forEach(c => selectedIds.add(c.id));
        });
      } else {
        // Uma única área - usar cardsPerArea
        const areaCards = state.cards.filter((c) => c.area === config.area).slice(0, config.cardsPerArea);
        selectedIds = new Set(areaCards.map(c => c.id));
      }

      const updated = state.cards.map((c) => ({
        ...c,
        enabled: selectedIds.has(c.id),
      }));

      dispatch({ type: "INIT", payload: updated });
      dispatch({ type: "RESET_SESSION" });
    },
    [state.cards]
  );

  return (
    <FlashcardContext.Provider
      value={{
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
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within FlashcardProvider");
  }
  return context;
}

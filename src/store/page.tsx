// store.ts
import { create } from "zustand";

interface TypingState {
  text: string;
  userInput: string;
  currentIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  errors: number;
  timeLimit: number;
  timeLeft: number;
  start: () => void;
  finish: () => void;
  reset: (text: string, limit: number) => void;
  setUserInput: (input: string) => void;
  tick: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  text: "",
  userInput: "",
  currentIndex: 0,
  isStarted: false,
  isFinished: false,
  errors: 0,
  timeLimit: 60,
  timeLeft: 60,

  start: () => set({ isStarted: true, isFinished: false }),
  finish: () => set({ isFinished: true, isStarted: false }),
  reset: (text, limit) =>
    set({
      text,
      userInput: "",
      currentIndex: 0,
      isStarted: false,
      isFinished: false,
      errors: 0,
      timeLimit: limit,
      timeLeft: limit,
    }),
  setUserInput: (input) =>
    set((state) => ({
      userInput: input,
      currentIndex: input.length,
      errors: input.split("").filter((c, i) => c !== state.text[i]).length,
    })),
  tick: () =>
    set((state) => ({
      timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0,
    })),
}));

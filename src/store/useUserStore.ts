"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  telegramId: number | null;
  setTelegramId: (id: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      telegramId: null,
      setTelegramId: (id) => {
        console.log("Setting Telegram ID:", id);
        set({ telegramId: id });
      },
      clearUser: () => set({ telegramId: null }),
    }),
    {
      name: "user-storage", // localStorage key
    }
  )
);

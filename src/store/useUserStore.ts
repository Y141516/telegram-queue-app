import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  telegramId: number | null;
  role: "leader" | "member" | null;

  setTelegramId: (id: number) => void;
  setRole: (role: "leader" | "member") => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      telegramId: null,
      role: null,

      setTelegramId: (id) => set({ telegramId: id }),

      setRole: (role) => set({ role }),

      resetUser: () =>
        set({
          telegramId: null,
          role: null,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);
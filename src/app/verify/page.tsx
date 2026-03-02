"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const initTelegram = async () => {
      const tg = (window as any).Telegram?.WebApp;

      if (!tg || !tg.initDataUnsafe?.user) {
        console.log("No Telegram user found");
        return;
      }

      const user = tg.initDataUnsafe.user;

      console.log("Telegram user:", user);

      // 🔥 SAVE TELEGRAM ID
      localStorage.setItem("telegram_id", user.id.toString());

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user.id.toString(),
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
          }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();

        console.log("Login response:", data);

        if (data.role === "User") {
          router.push("/User/home");
        } else if (data.role === "Leader") {
          router.push("/Leader/home");
        } else {
          console.log("Unknown role");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    initTelegram();
  }, [router]);

  return <p>Verifying...</p>;
}
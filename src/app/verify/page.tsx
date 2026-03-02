"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const waitForTelegram = () => {
      const tg = (window as any).Telegram?.WebApp;

      if (!tg || !tg.initDataUnsafe?.user) {
        // Wait and try again
        setTimeout(waitForTelegram, 300);
        return;
      }

      const user = tg.initDataUnsafe.user;

      // Save telegram ID
      localStorage.setItem("telegram_id", user.id.toString());

      fetch("/api/login", {
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
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.role === "User") {
            router.push("/User/home");
          } else if (data.role === "Leader") {
            router.push("/Leader/home");
          }
        })
        .catch((err) => {
          console.error("Login error:", err);
        });
    };

    waitForTelegram();
  }, [router]);

  return <p>Verifying...</p>;
}
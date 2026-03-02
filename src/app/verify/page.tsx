"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;

        if (!tg) {
          alert("This app must be opened inside Telegram.");
          return;
        }

        tg.ready();

        const telegramUser = tg.initDataUnsafe?.user;

        if (!telegramUser) {
          alert("No Telegram user found.");
          return;
        }

        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: telegramUser.id,
            username: telegramUser.username,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Backend error:", data);
          alert("Backend error: " + JSON.stringify(data));
          return;
        }


        console.log("User verified:", data);

        localStorage.setItem(
          "telegram_id",
          telegramUser.id.toString()
        );

        router.push("/User/home");
      } catch (error) {
        console.error("Verification error:", error);
        alert("Verification failed.");
      }
    };

    verifyUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Verifying Telegram account...
    </div>
  );
}
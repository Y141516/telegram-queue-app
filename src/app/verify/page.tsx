"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  const [loadingText, setLoadingText] = useState("Verifying...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingText("Checking Telegram...");

        if (typeof window === "undefined") {
          throw new Error("Window not available");
        }

        const tg = (window as any).Telegram?.WebApp;

        if (!tg) {
          throw new Error("Open this mini app inside Telegram.");
        }

        tg.ready();

        const user = tg.initDataUnsafe?.user;

        if (!user || !user.id) {
          throw new Error("Telegram user data not found.");
        }

        setLoadingText("Loading profile...");

        const response = await fetch("/api/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: user.id,
            username: user.username ?? null,
            first_name: user.first_name ?? null,
            last_name: user.last_name ?? null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load profile.");
        }

        setLoadingText("Success!");

        // Redirect after success
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err: any) {
        console.error("VERIFY ERROR:", err);
        setError(err.message || "Something went wrong.");
      }
    };

    init();
  }, [router]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Error</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">{loadingText}</h1>
      </div>
    </div>
  );
}
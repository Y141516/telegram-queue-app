"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;

    if (!tg || !tg.initDataUnsafe?.user) {
      return;
    }

    const user = tg.initDataUnsafe.user;

    // Save telegram ID
    localStorage.setItem("telegram_id", user.id.toString());

    const login = async () => {
      try {
        const res = await fetch("/api/login", {
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

        if (!res.ok) {
          throw new Error("Login request failed");
        }

        const data = await res.json();

        console.log("Login response:", data);

        if (data.role === "User") {
          router.replace("/User/home");
        } else if (data.role === "Leader") {
          router.replace("/Leader/home");
        } else {
          alert("Role not found");
        }
      } catch (err) {
        alert("Login API failed");
        console.error(err);
      }
    };

    login();
  }, [router]);

  return <p>Verifying...</p>;
}
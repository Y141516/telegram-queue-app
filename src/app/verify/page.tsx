"use client";

import { useEffect } from "react";

export default function VerifyPage() {
  useEffect(() => {
    const tg = window?.Telegram?.WebApp;

    console.log("Telegram object:", tg);

    if (tg) {
      tg.expand();
      console.log("initDataUnsafe:", tg.initDataUnsafe);
      console.log("user:", tg.initDataUnsafe?.user);
    } else {
      console.log("Telegram NOT found");
    }
  }, []);

  return <p>Check console...</p>;
}
"use client";

import { useEffect } from "react";

export default function UserSetup() {
  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) {
      alert("User not verified");
    }
  }, []);

  return (
    <div className="p-4 text-white">
      User Setup Page
    </div>
  );
}
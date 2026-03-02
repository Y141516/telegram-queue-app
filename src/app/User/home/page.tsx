"use client";

import { useEffect, useState } from "react";

export default function UserHome() {
  const [message, setMessage] = useState("🔄 Verifying...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get telegram id from localStorage
        const telegramId = localStorage.getItem("telegram_id");

        if (!telegramId) {
          setMessage("❌ No telegram_id found in localStorage");
          return;
        }

        setMessage("🔄 Fetching user from API...");

        // Call backend API (NOT Supabase directly)
        const res = await fetch("/api/get-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telegram_id: telegramId }),
        });

        const result = await res.json();

        if (!res.ok) {
          setMessage("❌ " + (result.error || "Unknown error"));
          return;
        }

        setMessage("✅ SUCCESS:\n" + JSON.stringify(result.user, null, 2));
      } catch (err: any) {
        setMessage("❌ Crash: " + err.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>User Home Debug</h2>
      <pre>{message}</pre>
    </div>
  );
}
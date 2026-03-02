"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function UserHome() {
  const [message, setMessage] = useState("Starting...");

  useEffect(() => {
    const run = async () => {
      const telegramId = localStorage.getItem("telegram_id");

      if (!telegramId) {
        setMessage("❌ No telegram_id in localStorage");
        return;
      }

      setMessage("Step 1: Found telegram_id = " + telegramId);

      try {
        setMessage("Step 2: Querying Supabase...");

        // 🔥 5 second timeout protection
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 5000)
        );

        const query = supabase
          .from("users")
          .select("*")
          .eq("telegram_id", Number(telegramId));

        const result = await Promise.race([query, timeout]) as any;

        const { data, error } = result;

        if (error) {
          setMessage("❌ Supabase error: " + error.message);
          return;
        }

        if (!data || data.length === 0) {
          setMessage("❌ No matching user found in DB");
          return;
        }

        setMessage("✅ SUCCESS: " + JSON.stringify(data[0]));
      } catch (err: any) {
        setMessage("❌ Crash: " + (err?.message || JSON.stringify(err)));
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>User Home Debug</h2>
      <p>{message}</p>
    </div>
  );
}
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
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("telegram_id", Number(telegramId));

        if (error) {
          setMessage("❌ Supabase error: " + error.message);
          return;
        }

        setMessage("Step 2: Raw response = " + JSON.stringify(data));

        if (!data || data.length === 0) {
          setMessage("❌ No matching user found in DB");
          return;
        }

        setMessage("✅ SUCCESS: " + JSON.stringify(data[0]));
      } catch (err) {
        setMessage("❌ Crash: " + err.message);
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
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function UserHome() {
  const [message, setMessage] = useState("Starting...");

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");

    if (!telegramId) {
      setMessage("❌ No telegram_id in localStorage");
      return;
    }

    setMessage("Found telegram_id: " + telegramId);

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (error) {
        setMessage("❌ Supabase error: " + error.message);
        return;
      }

      if (!data) {
        setMessage("❌ No user found in database");
        return;
      }

      setMessage("✅ User found: " + JSON.stringify(data));
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>User Home Debug</h2>
      <p>{message}</p>
    </div>
  );
}
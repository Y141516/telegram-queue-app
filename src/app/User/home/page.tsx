"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function UserHome() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");
  const [telegramIdDisplay, setTelegramIdDisplay] = useState("");

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    setTelegramIdDisplay(telegramId || "NULL");

    if (!telegramId) {
      setError("No telegram_id in localStorage");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("telegram_id", telegramId)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "red" }}>ERROR: {error}</h2>
        <p>
          <strong>localStorage telegram_id:</strong> {telegramIdDisplay}
        </p>
      </div>
    );
  }

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {profile.first_name}</h1>
      <p>Telegram ID: {profile.telegram_id}</p>
    </div>
  );
}
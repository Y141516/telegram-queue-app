"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserProfile = {
  telegram_id: string;
  first_name: string;
};

export default function UserHome() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const telegramId = localStorage.getItem("telegram_id");

      if (!telegramId) {
        setError("No telegram ID found");
        return;
      }

      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("telegram_id", telegramId)
          .maybeSingle();

        if (error) {
          setError(error.message);
          return;
        }

        if (!data) {
          setError("User not found in database");
          return;
        }

        setProfile(data as UserProfile);
      };

      fetchProfile();
    } catch (err) {
      console.error("Crash:", err);
      setError("Page crashed");
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        ERROR: {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "20px" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome {profile.first_name}</h1>
    </div>
  );
}
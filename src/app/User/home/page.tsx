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
    const telegramId = localStorage.getItem("telegram_id");

    console.log("Telegram ID:", telegramId);

    if (!telegramId) {
      setError("No telegram_id in localStorage");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      console.log("Supabase response:", data, error);

      if (error) {
        setError(error.message);
        return;
      }

      if (!data) {
        setError("No user found in database");
        return;
      }

      setProfile(data as UserProfile);
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl">Welcome {profile.first_name}</h1>
    </div>
  );
}
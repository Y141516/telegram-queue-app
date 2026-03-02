"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserProfile = {
  telegram_id: string;
  first_name: string;
};

export default function UserHome() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegramId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl">Welcome {profile.first_name}</h1>
    </div>
  );
}
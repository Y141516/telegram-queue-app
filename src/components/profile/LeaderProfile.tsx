"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type LeaderProfileType = {
  first_name: string;
};

export default function LeaderProfile() {
  const [profile, setProfile] = useState<LeaderProfileType | null>(null);

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegramId)
        .single();

      if (data) {
        setProfile(data as LeaderProfileType);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="p-4 text-white">
      <h2>Leader Profile</h2>
      <p>{profile.first_name}</p>
    </div>
  );
}
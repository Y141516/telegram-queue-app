"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type UserProfileType = {
  first_name: string;
};

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileType | null>(null);

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .single();

      if (data) {
        setProfile(data as UserProfileType);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="p-4 text-white">
      <h2>User Profile</h2>
      <p>{profile.first_name}</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  UserCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function LeaderProfile() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-5">
      <div className="bg-[#1a1d23] rounded-2xl p-6 text-center">
        <UserCircleIcon className="h-20 w-20 mx-auto text-gray-500 mb-4" />

        <h2 className="text-xl font-semibold">
          {profile.full_name}
        </h2>

        <div className="flex justify-center items-center text-gray-400 mt-2 gap-1">
          <MapPinIcon className="h-4 w-4" />
          {profile.district} / {profile.zone}
        </div>

        {profile.verified && (
          <div className="flex justify-center items-center text-green-400 mt-2 gap-1">
            <ShieldCheckIcon className="h-4 w-4" />
            Verified Leader
          </div>
        )}
      </div>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/";
        }}
        className="mt-6 w-full bg-red-900/30 border border-red-700 text-red-400 py-3 rounded-xl flex justify-center items-center gap-2"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}

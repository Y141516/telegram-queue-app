"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function SetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        name,
        city,
      })
      .eq("id", user.id);

    router.push("/User/home");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold mb-8">
        Complete Your Profile
      </h1>

      <input
        placeholder="Enter your name"
        className="bg-neutral-800 p-4 rounded-lg mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Enter your city"
        className="bg-neutral-800 p-4 rounded-lg mb-6"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 py-4 rounded-lg"
      >
        Save
      </button>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const telegramId = user.user_metadata?.telegram_id;

      if (!telegramId) return;

      // ⚠️ IMPORTANT
      // Replace this with your real group detection logic
      // For now we assume group is already determined
      const detectedGroupName = user.user_metadata?.group_name;

      if (!detectedGroupName) {
        alert("User is not part of a verified group.");
        return;
      }

      // ✅ SAVE PROFILE WITH GROUP
      await supabase.from("profiles").upsert({
        id: user.id,
        telegram_id: telegramId,
        role: "user",
        group_name: detectedGroupName,
      });

      router.push("/User/home");
    };

    verifyUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Verifying telegram account...
    </div>
  );
}
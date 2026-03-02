"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MessageForm() {
  const [content, setContent] = useState<string>("");

  const sendMessage = async () => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) return;

    await supabase.from("messages").insert([
      {
        sender_telegram_id: telegramId,
        content,
      },
    ]);

    setContent("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 text-black"
      />
      <button onClick={sendMessage} className="bg-blue-500 px-4">
        Send
      </button>
    </div>
  );
}
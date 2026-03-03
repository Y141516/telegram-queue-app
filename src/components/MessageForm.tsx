"use client";

import { useState } from "react";
import { getSupabase } from "../lib/supabaseClient";

interface MessageFormProps {
  leaderId: string;
}

export default function MessageForm({ leaderId }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const telegramId = localStorage.getItem("telegram_id");

      if (!telegramId) {
        alert("User not logged in");
        return;
      }

      const supabase = getSupabase();
      const { error } = await supabase.from("messages").insert([
        {
          sender_telegram_id: telegramId,
          leader_id: leaderId,
          content: message,
        },
      ]);

      if (error) throw error;

      setMessage("");
      alert("Message sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
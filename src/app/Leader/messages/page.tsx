"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  id: number;
  content: string;
  leader_telegram_id: string;
};

export default function LeaderMessagePage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const telegramId = localStorage.getItem("telegram_id");
    if (!telegramId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("leader_telegram_id", telegramId);

      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-xl mb-4">Leader Messages</h1>
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2 border p-2">
          {msg.content}
        </div>
      ))}
    </div>
  );
}
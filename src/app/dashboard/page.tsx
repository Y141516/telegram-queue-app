"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type Message = {
  id: string;
  content: string;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const supabase = getSupabase();

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setMessages(data || []);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Messages</h1>

      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className="mb-4 p-4 bg-gray-100 rounded-xl shadow-sm"
          >
            <p className="mb-2">{msg.content}</p>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>{msg.status}</span>
              <span>
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
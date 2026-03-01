"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import LeaderNavbar from "@/components/navigation/LeaderNavbarTemp";

interface Message {
  id: string;
  content: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function LeaderMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("leader_id", user.id)
      .eq("status", activeTab)
      .order("created_at", { ascending: false });

    setMessages(data || []);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex justify-center pb-20">
      <div className="w-full max-w-md p-5">
        <h1 className="text-2xl font-semibold mb-4">Messages</h1>

        {/* Tabs */}
        <div className="flex gap-6 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-2 ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setActiveTab("resolved")}
            className={`pb-2 ${
              activeTab === "resolved"
                ? "border-b-2 border-green-500"
                : "text-gray-500"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-gray-500 text-sm">
              No messages found.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => router.push(`/leader/messages/${msg.id}`)}
              className={`p-4 rounded-xl cursor-pointer border ${
                msg.priority === "emergency"
                  ? "bg-red-900/30 border-red-700"
                  : "bg-[#1a1d23] border-gray-800"
              }`}
            >
              <div className="text-sm text-gray-400 mb-2">
                {new Date(msg.created_at).toLocaleString()}
              </div>

              <p className="text-white line-clamp-2">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <LeaderNavbar />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import LeaderNavbar from "@/components/navigation/LeaderNavbar";

interface Message {
  id: string;
  content: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function MessageDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchMessage = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    setMessage(data);
  };

  const handleResolve = async () => {
    if (!message) return;

    const { error } = await supabase
      .from("messages")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", message.id);

    if (!error) {
      router.push("/leader/messages");
    }
  };

  if (!message) return null;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex justify-center pb-20">
      <div className="w-full max-w-md p-5">
        <h1 className="text-xl font-semibold mb-4">
          Message Details
        </h1>

        <div
          className={`p-5 rounded-2xl border ${
            message.priority === "emergency"
              ? "bg-red-900/30 border-red-700"
              : "bg-[#1a1d23] border-gray-800"
          }`}
        >
          <div className="text-sm text-gray-400 mb-3">
            {new Date(message.created_at).toLocaleString()}
          </div>

          <p className="text-lg">{message.content}</p>
        </div>

        {message.status === "pending" && (
          <button
            onClick={handleResolve}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
          >
            Mark as Resolved
          </button>
        )}
      </div>

      <LeaderNavbar />
    </div>
  );
}
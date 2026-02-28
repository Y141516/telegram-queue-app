"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  ClockIcon,
  BoltIcon,
  TruckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function UserHomePage() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [group, setGroup] = useState("");
  const [latestMessage, setLatestMessage] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // ✅ Load profile correctly
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, group_name")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      // ✅ If name not set → go to setup
      if (!profile.name) {
        router.push("/User/setup");
        return;
      }

      setUserName(profile.name);
      setGroup(profile.group_name);

      // Load latest message
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (messages && messages.length > 0) {
        setLatestMessage(messages[0]);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0f14] to-[#0b0d12] text-white px-5 pt-6 pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <ArrowLeftIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-semibold">Messenger</h1>
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#1c2431] to-[#1a1f2b] shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">
              Jay Bhagwanji {userName}
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Group: {group}
            </p>
          </div>

          <span className="bg-green-600 text-xs px-4 py-1 rounded-full">
            Verified
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
          Your messages reach the leaders of your verified group.
          Replies typically arrive within 24–48 hours.
        </p>
      </div>

      {/* SEND BUTTON */}
      <button
        onClick={() => router.push("/User/send")}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl text-lg font-medium mb-6 transition shadow-md"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        Send Message
      </button>

      {/* CURRENT MESSAGE */}
      {latestMessage && (
        <>
          <p className="text-xs tracking-widest text-gray-500 mb-3">
            CURRENT MESSAGE
          </p>

          <div className="bg-[#1a1f2b] rounded-xl p-5 mb-8 border border-yellow-600/30">
            <div className="flex gap-4">
              <ClockIcon className="h-6 w-6 text-yellow-500 mt-1" />
              <div>
                <p className="text-sm leading-relaxed">
                  {latestMessage.content}
                </p>
                <p className="text-xs text-yellow-500 mt-2">
                  Pending reply
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EMERGENCY */}
      <p className="text-xs tracking-widest text-gray-500 mb-3">
        EMERGENCY SERVICES
      </p>

      <div className="grid grid-cols-3 gap-4">
        <button className="bg-red-600/20 border border-red-600 rounded-xl py-6 flex flex-col items-center">
          <HeartIcon className="h-6 w-6 text-red-500 mb-2" />
          <span className="text-sm">Medical</span>
        </button>

        <button className="bg-orange-600/20 border border-orange-600 rounded-xl py-6 flex flex-col items-center">
          <TruckIcon className="h-6 w-6 text-orange-500 mb-2" />
          <span className="text-sm">Transport</span>
        </button>

        <button className="bg-yellow-600/20 border border-yellow-600 rounded-xl py-6 flex flex-col items-center">
          <BoltIcon className="h-6 w-6 text-yellow-500 mb-2" />
          <span className="text-sm">Urgent</span>
        </button>
      </div>

    </div>
  );
}
"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function LeaderNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const itemClass = (path: string) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-white" : "text-gray-500"
    }`;

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-[#1a1d23] border-t border-gray-800 flex justify-around py-3">
      <button
        onClick={() => router.push("/leader/dashboard")}
        className={itemClass("/leader/dashboard")}
      >
        <HomeIcon className="h-5 w-5" />
        Dashboard
      </button>

      <button
        onClick={() => router.push("/leader/messages")}
        className={itemClass("/leader/messages")}
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
        Messages
      </button>

      <button
        onClick={() => router.push("/leader/profile")}
        className={itemClass("/leader/profile")}
      >
        <UserIcon className="h-5 w-5" />
        Profile
      </button>
    </div>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function UserNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const itemClass = (path: string) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-white" : "text-gray-500"
    }`;

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-[#1a1d23] border-t border-gray-800 flex justify-around py-3">
      <button
        onClick={() => router.push("/User/home")}
        className={itemClass("/User/home")}
      >
        <HomeIcon className="h-5 w-5" />
        Home
      </button>

      <button
        onClick={() => router.push("/User/send")}
        className={itemClass("/User/send")}
      >
        <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
        Send
      </button>

      <button
        onClick={() => router.push("/User/profile")}
        className={itemClass("/User/profile")}
      >
        <UserIcon className="h-5 w-5" />
        Profile
      </button>
    </div>
  );
}

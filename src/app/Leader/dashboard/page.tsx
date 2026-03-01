"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import LeaderNavbar from "@/components/navigation/LeaderNavbar";

export default function LeaderDashboardPage() {
  const router = useRouter();
  const { role } = useUserStore();

  useEffect(() => {
    if (role && role !== "leader") {
      router.replace("/user/home");
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <div className="min-h-screen bg-[#0f1115] text-white flex justify-center pb-20">
      <div className="w-full max-w-md p-5">
        <h1 className="text-2xl font-semibold mb-4">
          Leader Dashboard
        </h1>

        <div className="bg-[#1a1d23] p-4 rounded-xl">
          Welcome back, Leader 👋
        </div>
      </div>

      <LeaderNavbar />
    </div>
  );
}

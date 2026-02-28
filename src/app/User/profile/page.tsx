"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import UserProfile from "@/components/profile/UserProfile";
import UserNavbar from "@/components/navigation/UserNavbar";

export default function UserProfilePage() {
  const router = useRouter();
  const { role } = useUserStore();

  useEffect(() => {
    if (role && role !== "user") {
      router.replace("/leader/dashboard");
    }
  }, [role, router]);

  if (!role) return null;

  return (
    <div className="pb-20">
      <UserProfile />
      <UserNavbar />
    </div>
  );
}

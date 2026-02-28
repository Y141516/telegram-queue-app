"use client";

import { Suspense } from "react";
import SendContent from "./SendContent";

export const dynamic = "force-dynamic";

export default function SendPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SendContent />
    </Suspense>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [info, setInfo] = useState("Checking...");

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;

    if (!tg) {
      setInfo("❌ Telegram object NOT found");
      return;
    }

    if (!tg.initDataUnsafe) {
      setInfo("❌ initDataUnsafe missing");
      return;
    }

    if (!tg.initDataUnsafe.user) {
      setInfo("❌ User NOT found inside initDataUnsafe");
      return;
    }

    setInfo("✅ User found: " + JSON.stringify(tg.initDataUnsafe.user));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify Debug</h2>
      <p>{info}</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const telegram = (window as any).Telegram?.WebApp;

    if (telegram) {
      telegram.ready();
      const id = telegram.initDataUnsafe?.user?.id;
      if (id) {
        setUserId(id);
        verifyUser(id);
      }
    }
  }, []);

  const verifyUser = async (id: number) => {
    const response = await fetch(
      "https://fwwqmhtpgvmqxkyxtgdo.supabase.co/functions/v1/verfiy-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3d3FtaHRwZ3ZtcXhreXh0Z2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjQ4NzYsImV4cCI6MjA4NjUwMDg3Nn0.2JVBatCl7RR24QMmHcrj3eYkptz6-8OQo7hEe6nnhnE"
        },
        body: JSON.stringify({ user_id: id })
      }
    );

    const data = await response.json();
    setVerified(data.verified);
  };

  const joinQueue = async () => {
    if (!userId) return;

    setLoading(true);
    setMessage("");

    const response = await fetch(
      "https://fwwqmhtpgvmqxkyxtgdo.supabase.co/functions/v1/join-queue",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_ANON_KEY"
        },
        body: JSON.stringify({ user_id: userId })
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("✅ You joined the queue!");
    } else {
      setMessage("❌ " + (data.error || "Something went wrong"));
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 30,
        fontFamily: "Arial",
        textAlign: "center"
      }}
    >
      <h1>Leader Message Queue</h1>

      {!userId && <p>Open inside Telegram...</p>}

      {verified === false && (
        <h3 style={{ color: "red" }}>You are not a group member.</h3>
      )}

      {verified && (
        <>
          <button
            onClick={joinQueue}
            disabled={loading}
            style={{
              padding: "12px 24px",
              backgroundColor: "#0088cc",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            {loading ? "Joining..." : "Join Queue"}
          </button>

          {message && (
            <div style={{ marginTop: 20 }}>
              <h3>{message}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function UserHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;

        if (!tg || !tg.initDataUnsafe?.user) {
          setError("Telegram user not found.");
          setLoading(false);
          return;
        }

        const telegramUser = tg.initDataUnsafe.user;

        const res = await fetch("/api/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramUser.id,
            first_name: telegramUser.first_name,
          }),
        });

        const text = await res.text();
        console.log("API RAW RESPONSE:", text);

        let result: any;
        try {
          result = JSON.parse(text);
        } catch (parseError) {
          throw new Error("Invalid JSON from API: " + text);
        }

        if (!res.ok) {
          setError(result.error || "Access denied.");
        } else {
          setData(result);
        }
      } catch (err: any) {
        console.error("FRONTEND ERROR:", err);
        setError(err?.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Verifying...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        ERROR: {error}
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 20 }}>No data received.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {data.user?.first_name}</h2>
      <p>Group: {data.group?.name}</p>

      <h3>Leaders</h3>
      {data.leaders?.map((leader: any) => (
        <div key={leader.id} style={{ marginBottom: 10 }}>
          <strong>{leader.name}</strong>
          <div>
            Open: {leader.is_open ? "Yes" : "No"} | Queue:{" "}
            {leader.current_count}/{leader.max_slots}
          </div>
        </div>
      ))}

      <hr />

      {data.canSendMessage ? (
        <button
          style={{
            padding: 10,
            backgroundColor: "green",
            color: "white",
            border: "none",
          }}
        >
          Send Message
        </button>
      ) : (
        <button
          disabled
          style={{
            padding: 10,
            backgroundColor: "gray",
            color: "white",
            border: "none",
          }}
        >
          Queue Closed
        </button>
      )}
    </div>
  );
}
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1️⃣ Check if already verified
    const { data: existingUser } = await supabase
      .from("verified_users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ verified: true, cached: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2️⃣ Not cached → verify with Telegram
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const GROUP_ID = Deno.env.get("TELEGRAM_GROUP_ID");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${GROUP_ID}&user_id=${user_id}`
    );

    const telegramData = await telegramResponse.json();

    const isVerified =
      telegramData.ok &&
      telegramData.result &&
      ["member", "administrator", "creator"].includes(
        telegramData.result.status
      );

    if (!isVerified) {
      return new Response(
        JSON.stringify({ verified: false }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3️⃣ Store verified user
    await supabase.from("verified_users").insert({
      user_id: user_id,
    });

    return new Response(
      JSON.stringify({ verified: true, cached: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
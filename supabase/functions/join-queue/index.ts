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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1️⃣ Check verified
    const { data: verifiedUser } = await supabase
      .from("verified_users")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (!verifiedUser) {
      return new Response(
        JSON.stringify({ error: "User not verified" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2️⃣ Get queue settings
    const { data: queue } = await supabase
      .from("queue_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!queue?.is_open) {
      return new Response(
        JSON.stringify({ error: "Queue is closed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (queue.current_count >= queue.max_slots) {
      return new Response(
        JSON.stringify({ error: "Queue Full" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3️⃣ Insert into queue
    await supabase.from("queue_entries").insert({
      user_id: user_id,
    });

    // 4️⃣ Increment counter
    await supabase
      .from("queue_settings")
      .update({
        current_count: queue.current_count + 1,
      })
      .eq("id", 1);

    return new Response(
      JSON.stringify({ success: true }),
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
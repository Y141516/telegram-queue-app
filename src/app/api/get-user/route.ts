import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/*
  SAFE ENV LOADING
  This prevents the vague "supabaseKey is required" error.
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!serviceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

// Create Supabase client ONCE (server-side only)
const supabase = createClient(supabaseUrl, serviceKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const telegramId = body?.telegram_id;

    if (!telegramId) {
      return NextResponse.json(
        { error: "No telegram_id provided" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // 2️⃣ Create user if not exists
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          telegram_id: telegramId,
          username: body.username ?? null,
          first_name: body.first_name ?? null,
          last_name: body.last_name ?? null,
          role: "creator",
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newUser);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
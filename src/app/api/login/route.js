import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

console.log("URL:",process.env.NEXT_PUBLIC_SUPABASE_URL);


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, username, first_name, last_name } = body;

    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", id)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (!existingUser) {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            telegram_id: id,
            username,
            first_name,
            last_name,
          },
        ])
        .single();

      if (error) throw error;

      return NextResponse.json(data);
    }

    return NextResponse.json(existingUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

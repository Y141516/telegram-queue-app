import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, username, first_name, last_name } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing Telegram ID" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", id)
      .maybeSingle();

    if (selectError) {
      console.error("Select error:", selectError);
      return NextResponse.json(
        { error: selectError.message },
        { status: 500 }
      );
    }

    // If user does NOT exist → create new one
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            telegram_id: id,
            username,
            first_name,
            last_name,
            role: "User", // 🔥 Default role
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        role: newUser.role,
      });
    }

    // If user exists → return their role
    return NextResponse.json({
      role: existingUser.role,
    });

  } catch (err) {
    console.error("Server crash:", err);
    return NextResponse.json(
      { error: "Server crashed" },
      { status: 500 }
    );
  }
}
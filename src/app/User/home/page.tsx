import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { telegram_id, first_name } = await req.json()

    if (!telegram_id) {
      return NextResponse.json({ error: "No telegram id" }, { status: 400 })
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegram_id)
      .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 403 })
    }

    return NextResponse.json({
      user,
      group: { name: "Demo Group" },
      leaders: [],
      canSendMessage: true,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
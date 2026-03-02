import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Route works",
    urlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
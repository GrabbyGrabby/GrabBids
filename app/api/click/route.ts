import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Attempt to update the clicks column directly using a read then write
    // In a production setup with DB access, an RPC function is better.
    const { data: item, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("id, clicks")
      .eq("id", id)
      .maybeSingle();

    if (!fetchError && item) {
      const currentClicks = item.clicks || 0;
      await supabaseAdmin
        .from("listings")
        .update({ clicks: currentClicks + 1 })
        .eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to register click" }, { status: 500 });
  }
}

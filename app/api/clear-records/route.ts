import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { error: tErr } = await supabaseAdmin
      .from("transactions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    const { error: pErr } = await supabaseAdmin
      .from("pending_submissions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    const { error: lErr } = await supabaseAdmin
      .from("listings")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    return NextResponse.json({
      success: true,
      cleared: { transactions: !tErr, pending: !pErr, listings: !lErr },
      errors: { tErr, pErr, lErr },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

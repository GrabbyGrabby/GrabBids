import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { listing_id } = await req.json();

    if (!listing_id) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const { data: current, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("id, amount_paid")
      .eq("id", listing_id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const newVotes = (current.amount_paid ?? 0) + 1;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("listings")
      .update({ amount_paid: newVotes })
      .eq("id", listing_id)
      .select("amount_paid")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update upvote" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      upvotes: updated?.amount_paid ?? newVotes,
    });
  } catch (err: any) {
    console.error("POST /api/upvote error:", err);
    return NextResponse.json({ error: "Failed to register upvote" }, { status: 500 });
  }
}

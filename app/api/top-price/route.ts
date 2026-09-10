import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: listings } = await supabaseAdmin
      .from("listings")
      .select("id, title, upvotes, click_count")
      .order("upvotes", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    const topVotes = listings?.upvotes ?? listings?.click_count ?? 0;
    const topTitle = listings?.title || "No products yet";

    // Get total count
    const { count } = await supabaseAdmin
      .from("listings")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      topTitle,
      topVotes,
      totalListings: count ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      topTitle: "Submit your SaaS",
      topVotes: 0,
      totalListings: 0,
    });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeUrl, getDisplayUrl, getFullUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("listings")
      .select("*")
      .order("amount_paid", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Listings fetch error:", error.message);
      return NextResponse.json({ listings: [] });
    }

    const formatted = (data ?? []).map((item: any) => ({
      id: item.id,
      product_name: item.product_name || item.title || "Untitled Project",
      product_url: getFullUrl(item.product_url || item.url || "#"),
      tagline: item.tagline || item.description || "",
      upvotes: item.amount_paid ?? 1,
      created_at: item.created_at,
      email: item.email,
    }));

    return NextResponse.json({ listings: formatted });
  } catch (err: any) {
    console.error("GET /api/listings error:", err);
    return NextResponse.json({ listings: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { product_name, product_url, tagline, email } = body;

    if (!product_name || product_name.trim().length < 1) {
      return NextResponse.json({ error: "Please enter a project name or title." }, { status: 400 });
    }

    if (!product_url || product_url.trim().length < 1) {
      return NextResponse.json({ error: "Please enter a URL or link (e.g. x.com/handle or your website)." }, { status: 400 });
    }

    const trimmedUrl = product_url.trim();
    const fullUrl = getFullUrl(trimmedUrl);
    const resolvedEmail = email && email.includes("@") ? email.trim() : "community@grabbids.com";

    // Check if listing already exists
    const { data: existing } = await supabaseAdmin
      .from("listings")
      .select("id, amount_paid")
      .eq("product_url", fullUrl)
      .maybeSingle();

    if (existing) {
      // Increment upvotes if already submitted
      const newVotes = (existing.amount_paid ?? 0) + 1;
      await supabaseAdmin
        .from("listings")
        .update({
          amount_paid: newVotes,
          product_name: product_name.trim().slice(0, 100),
          tagline: (tagline || "").trim().slice(0, 200),
        })
        .eq("id", existing.id);

      return NextResponse.json({
        success: true,
        isNew: false,
        listing: { id: existing.id, upvotes: newVotes },
      });
    }

    // Insert new listing with 1 initial upvote
    const { data: newListing, error: insertError } = await supabaseAdmin
      .from("listings")
      .insert({
        product_name: product_name.trim().slice(0, 100),
        product_url: fullUrl,
        tagline: (tagline || "").trim().slice(0, 200),
        email: resolvedEmail,
        amount_paid: 1,
        status: "confirmed",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit project: " + insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isNew: true,
      listing: newListing,
    });
  } catch (err: any) {
    console.error("POST /api/listings error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit link." }, { status: 500 });
  }
}

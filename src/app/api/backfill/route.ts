import { NextResponse } from 'next/server';
import { backfillSummaries } from '@/../scripts/backfillSummaries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export function HEAD() {
  console.log("🔍 [backfill] HEAD ping");
  return new Response(null, { status: 200 });
}

export async function GET() {
  try {
    console.log("🔄 [backfill] GET starting");
    await backfillSummaries();
    console.log("✅ [backfill] GET finished");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ backfill failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

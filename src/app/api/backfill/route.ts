import { NextResponse } from 'next/server';
import { backfillSummaries } from '@/../scripts/backfillSummaries';

export async function GET() {
  try {
    await backfillSummaries();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("❌ backfill failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

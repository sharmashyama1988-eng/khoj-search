import { NextRequest, NextResponse } from 'next/server';
import { runKhojAgent } from '@/lib/agent/engine';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || searchParams.get('query') || '';
  const lang = searchParams.get('lang') || 'en';

  if (!q.trim()) {
    return NextResponse.json({
      status: 'error',
      message: 'Query parameter "q" is required.',
      usage: '/api/agent?q=<your_query>&lang=en',
    }, { status: 400 });
  }

  try {
    const origin = req.nextUrl.origin;
    const result = await runKhojAgent({ query: q, lang, origin });

    return NextResponse.json({
      status: 'success',
      agent: 'Khoj Autonomous Agentic Engine v2.5',
      ...result,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: String(error),
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { query?: string; lang?: string };
    const q = body.query || '';
    const lang = body.lang || 'en';

    if (!q.trim()) {
      return NextResponse.json({ error: 'Field "query" is required.' }, { status: 400 });
    }

    const origin = req.nextUrl.origin;
    const result = await runKhojAgent({ query: q, lang, origin });

    return NextResponse.json({
      status: 'success',
      agent: 'Khoj Autonomous Agentic Engine v2.5',
      ...result,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get('text') || searchParams.get('q') || '').trim();
  const from = (searchParams.get('from') || 'auto').toLowerCase();
  const to   = (searchParams.get('to')   || 'hi').toLowerCase();

  return executeTranslation(text, from, to);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { text?: string; from?: string; to?: string };
    const text = (body.text || '').trim();
    const from = (body.from || 'auto').toLowerCase();
    const to   = (body.to   || 'hi').toLowerCase();

    return executeTranslation(text, from, to);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

async function executeTranslation(text: string, from: string, to: string) {
  if (!text) {
    return NextResponse.json({ error: 'Parameter "text" is required.' }, { status: 400 });
  }

  const langpair = from === 'auto' ? `en|${to}` : `${from}|${to}`;

  try {
    // 1. Primary Engine: MyMemory Neural Translation
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${encodeURIComponent(langpair)}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json() as {
        responseData?: { translatedText?: string; match?: number };
        responseStatus?: number;
      };

      if (data.responseData?.translatedText) {
        return NextResponse.json({
          status: 'success',
          originalText: text,
          translatedText: data.responseData.translatedText,
          from,
          to,
          engine: 'MyMemory Neural Translation',
        });
      }
    }

    // 2. Secondary Engine: Lingva Free Instance Fallback
    const lingvaUrl = `https://lingva.ml/api/v1/${from}/${to}/${encodeURIComponent(text.slice(0, 500))}`;
    const lingvaRes = await fetch(lingvaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    });

    if (lingvaRes.ok) {
      const lData = await lingvaRes.json() as { translation?: string };
      if (lData.translation) {
        return NextResponse.json({
          status: 'success',
          originalText: text,
          translatedText: lData.translation,
          from,
          to,
          engine: 'Lingva Neural Engine',
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      originalText: text,
      translatedText: text, // Echo back on total failure
      from,
      to,
      engine: 'Echo Fallback',
    });
  } catch (error) {
    return NextResponse.json({
      error: `Translation error: ${String(error)}`,
      originalText: text,
      translatedText: text,
    }, { status: 500 });
  }
}

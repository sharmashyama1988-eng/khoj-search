import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get('text') || searchParams.get('q') || '').trim();
  const lang = (searchParams.get('lang') || searchParams.get('tl') || 'en').trim();

  if (!text) {
    return NextResponse.json({ error: 'Text parameter "text" is required.' }, { status: 400 });
  }

  // Truncate to max 300 characters per utterance chunk
  const cleanText = text.slice(0, 300);

  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg,audio/*;q=0.9',
      },
      next: { revalidate: 86400 },
    });

    if (!audioRes.ok) {
      return NextResponse.json({ error: 'TTS upstream unavailable.' }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, immutable',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

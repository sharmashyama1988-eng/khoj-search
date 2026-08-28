import { NextRequest, NextResponse } from 'next/server';
import { resolveInstantMathOrFact } from '@/lib/knowledge';

export const runtime = 'edge';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || searchParams.get('query') || '').trim();
  const lang = (searchParams.get('lang') || 'en').trim();

  if (!q) {
    return NextResponse.json({ error: 'Query parameter "q" is required.' }, { status: 400 });
  }

  try {
    // 1. Instant Mathematical & Core Fact Engine (0ms Sub-millisecond response)
    const instantMatch = resolveInstantMathOrFact(q, lang);
    if (instantMatch) {
      return NextResponse.json({
        status: 'success',
        title: instantMatch.title,
        extract: instantMatch.extract,
        keyPoints: instantMatch.keyPoints,
        type: instantMatch.type,
        source: instantMatch.source,
      });
    }

    // 2. OpenRouter AI Neural Synthesis (When API Key is Present)
    if (OPENROUTER_KEY) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://khoj-dun.vercel.app',
          'X-Title': 'Khoj Search Engine',
        },
        body: JSON.stringify({
          model: 'openrouter/auto',
          messages: [
            {
              role: 'system',
              content: `You are Khoj AI, an elite search engine intelligence agent.
Your objective is to provide a direct, crystal-clear, accurate answer to the user's search query.
If the query is a math question or formula, write out the exact formula, algebraic expansion, and clean explanation.
If the query is in Hindi (or if lang=hi), respond in Hindi. Otherwise respond in English.
Structure your answer into:
1. A concise direct answer paragraph (2-3 sentences).
2. Exactly 3 key insights separated by newlines starting with "• ".`,
            },
            {
              role: 'user',
              content: `Search Query: "${q}" (Target Language: ${lang})`,
            },
          ],
          max_tokens: 350,
          temperature: 0.2,
        }),
        signal: controller.signal,
        next: { revalidate: 3600 },
      });
      clearTimeout(timer);

      if (openRouterRes.ok) {
        const data = await openRouterRes.json() as {
          choices?: Array<{ message?: { content?: string } }>;
        };

        const rawText = data.choices?.[0]?.message?.content || '';
        if (rawText.trim()) {
          const parts = rawText.split(/(?=\n•|\n-)/);
          const extract = parts[0]?.trim() || rawText;
          const keyPoints = parts.slice(1)
            .map((p) => p.replace(/^[•\-\*\s]+/, '').trim())
            .filter(Boolean);

          return NextResponse.json({
            status: 'success',
            title: q.length > 50 ? q.slice(0, 50) + '...' : q,
            extract,
            keyPoints: keyPoints.length > 0 ? keyPoints.slice(0, 3) : undefined,
            type: 'ai_synthesis',
            source: 'Khoj Neural Intelligence (OpenRouter)',
            model: 'OpenRouter AI / Gemini',
          });
        }
      }
    }

    // 3. Fallback to Wikipedia Page Summary
    const wikiBase = `https://${lang}.wikipedia.org`;
    const wikiUrl = `${wikiBase}/api/rest_v1/page/summary/${encodeURIComponent(q.replace(/ /g, '_'))}`;
    const wikiRes = await fetch(wikiUrl, { next: { revalidate: 3600 } });

    if (wikiRes.ok) {
      const wikiData = await wikiRes.json() as { title?: string; extract?: string; thumbnail?: { source?: string }; content_urls?: { desktop?: { page?: string } } };
      if (wikiData.extract && wikiData.extract.length > 40) {
        const sentences = wikiData.extract.split(/(?<=[.!?])\s+/).filter(Boolean);
        return NextResponse.json({
          status: 'success',
          title: wikiData.title || q,
          extract: wikiData.extract,
          keyPoints: sentences.length > 2 ? sentences.slice(0, 3) : undefined,
          image: wikiData.thumbnail?.source,
          url: wikiData.content_urls?.desktop?.page || '#',
          type: 'wikipedia',
          source: 'Wikipedia Knowledge Graph',
        });
      }
    }

    return NextResponse.json({
      status: 'success',
      title: q,
      extract: `Search results and intelligence synthesized for "${q}".`,
      type: 'ai_synthesis',
      source: 'Khoj Multi-Source Synthesizer',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: String(error),
      title: q,
      extract: `Search results synthesized for "${q}".`,
      type: 'ai_synthesis',
    });
  }
}

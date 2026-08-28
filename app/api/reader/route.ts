import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url') || searchParams.get('targetUrl') || '';
  return handleReadUrl(targetUrl);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { targetUrl?: string; url?: string };
    const targetUrl = body.targetUrl || body.url || '';
    return handleReadUrl(targetUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
  }
}

async function handleReadUrl(targetUrl: string) {
  if (!targetUrl.trim()) {
    return NextResponse.json({ error: 'Parameter "url" or "targetUrl" is required.' }, { status: 400 });
  }

  const cleanUrl = targetUrl.trim();
  const isValid = /^(https?:\/\/)?([a-z0-9-]+(\.[a-z0-9-]+)+)(:\d+)?(\/.*)?$/i.test(cleanUrl);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid web URL format provided.' }, { status: 400 });
  }

  const finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;

  try {
    // 1. Fetch from Jina AI Reader (Fast, clean Markdown extraction)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const jinaRes = await fetch(`https://r.jina.ai/${finalUrl}`, {
      headers: {
        'Accept': 'application/json',
        'X-Return-Format': 'markdown',
        'X-No-Cache': 'false',
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);

    if (jinaRes.ok) {
      const data = await jinaRes.json() as {
        data?: { title?: string; description?: string; content?: string; url?: string };
      };

      const title = data.data?.title || getDomain(finalUrl);
      const content = data.data?.content || '';
      const description = data.data?.description || content.slice(0, 240);
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      return NextResponse.json({
        status: 'success',
        title,
        url: finalUrl,
        domain: getDomain(finalUrl),
        description,
        content,
        wordCount,
        readingTimeMinutes,
        source: 'Jina AI Reader / Clean DOM',
      });
    }

    // 2. Direct HTML Fallback if Jina is unavailable
    const htmlRes = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      next: { revalidate: 1800 },
    });

    if (!htmlRes.ok) {
      return NextResponse.json({
        error: `Could not retrieve page: HTTP ${htmlRes.status}`,
        url: finalUrl,
      }, { status: 502 });
    }

    const html = await htmlRes.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : getDomain(finalUrl);

    // Strip scripts, styles, navigations
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      status: 'success',
      title,
      url: finalUrl,
      domain: getDomain(finalUrl),
      description: cleanText.slice(0, 240),
      content: cleanText.slice(0, 8000),
      wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      source: 'Direct HTML Parser',
    });
  } catch (error) {
    return NextResponse.json({
      error: `Failed to load reader mode: ${String(error)}`,
      url: finalUrl,
    }, { status: 500 });
  }
}

function getDomain(urlStr: string): string {
  try {
    return new URL(urlStr).hostname.replace(/^www\./, '');
  } catch {
    return urlStr;
  }
}

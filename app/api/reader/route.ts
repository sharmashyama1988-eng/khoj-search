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

function cleanArticleMarkdown(rawMarkdown: string, domain: string): string {
  let text = rawMarkdown;

  // 1. Remove markdown images & HTML images
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/gi, '');
  text = text.replace(/<img[^>]*>/gi, '');

  // 2. Clean raw link syntax [Title](url) -> Title
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 3. Remove standalone tracking URLs
  text = text.replace(/https?:\/\/[^\s]+/gi, (url) => url.length > 55 ? '' : url);

  const lines = text.split('\n');
  const cleanedLines: string[] = [];

  const BOILERPLATE_PATTERNS = [
    /sign\s*up/i,
    /log\s*in/i,
    /terms\s*of\s*service/i,
    /privacy\s*policy/i,
    /cookie/i,
    /accept\s*all/i,
    /by\s*clicking/i,
    /sign\s*in/i,
    /^#*\s*OR$/i,
    /^#*\s*Email$/i,
    /^#*\s*Password$/i,
    /^#*\s*Submit$/i,
    /^#*\s*Search$/i,
    /^#*\s*$/i,
    /advertisement/i,
    /subscribe/i,
    /share\s*on/i,
    /follow\s*us/i,
    /all\s*rights\s*reserved/i,
    /skip\s*to\s*(?:main\s*)?content/i,
    /navigation\s*menu/i,
    /create\s*a\s*free\s*team/i,
    /ask\s*question/i,
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const isBoilerplate = BOILERPLATE_PATTERNS.some((pattern) => pattern.test(trimmed));
    if (isBoilerplate && trimmed.length < 90) continue;

    if (trimmed.toLowerCase().includes(domain.toLowerCase()) && (trimmed.includes('©') || trimmed.includes('All Rights'))) {
      continue;
    }

    cleanedLines.push(trimmed);
  }

  const result = cleanedLines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return result;
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
  const domain = getDomain(finalUrl);

  try {
    // 1. Fetch from Jina AI Reader
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7500);

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

      const title = data.data?.title?.replace(/ - .*$/, '') || domain;
      const rawContent = data.data?.content || '';
      const cleanContent = cleanArticleMarkdown(rawContent, domain);
      const description = data.data?.description || cleanContent.slice(0, 240);
      const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
      const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

      if (cleanContent.length >= 80) {
        return NextResponse.json({
          status: 'success',
          title,
          url: finalUrl,
          domain,
          description,
          content: cleanContent,
          wordCount,
          readingTimeMinutes,
          source: `${domain} via Clean Reader`,
        });
      }
    }

    // 2. Direct HTML Fallback Parser (Extracts structured article paragraphs)
    const htmlRes = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
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
    const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : domain;

    // Extract paragraphs and headings
    const pMatches = html.match(/<(?:p|h1|h2|h3|h4|li)[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4|li)>/gi) || [];
    const extractedParagraphs: string[] = [];

    pMatches.forEach((chunk) => {
      const plain = chunk.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (plain.length > 30) {
        extractedParagraphs.push(plain);
      }
    });

    const bodyText = extractedParagraphs.length > 0 ? extractedParagraphs.join('\n\n') : html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const sanitized = cleanArticleMarkdown(bodyText.slice(0, 12000), domain);
    const wordCount = sanitized.split(/\s+/).filter(Boolean).length;

    return NextResponse.json({
      status: 'success',
      title,
      url: htmlRes.url || finalUrl,
      domain: getDomain(htmlRes.url || finalUrl),
      description: sanitized.slice(0, 240),
      content: sanitized,
      wordCount,
      readingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      source: 'Verified Clean Parser',
    });
  } catch (error) {
    return NextResponse.json({
      error: `Failed to load clean reader: ${String(error)}`,
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

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export interface InstantAnswerResponse {
  found: boolean;
  heading?: string;
  abstract?: string;
  source?: string;
  url?: string;
  image?: string;
  entityType?: string;
  relatedTopics?: Array<{ text: string; url: string; icon?: string }>;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (!q) {
    return NextResponse.json({ found: false });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    clearTimeout(timer);

    if (!res.ok) return NextResponse.json({ found: false });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;

    const heading = data.Heading || '';
    const abstract = data.AbstractText || data.Abstract || '';
    const source = data.AbstractSource || 'DuckDuckGo Knowledge';
    const url = data.AbstractURL || '';
    const image = data.Image ? (data.Image.startsWith('http') ? data.Image : `https://duckduckgo.com${data.Image}`) : undefined;
    const entityType = data.Entity || data.Type || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const relatedTopics: Array<{ text: string; url: string; icon?: string }> = [];
    if (Array.isArray(data.RelatedTopics)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.RelatedTopics.slice(0, 5).forEach((t: any) => {
        if (t.Text && t.FirstURL) {
          relatedTopics.push({
            text: t.Text,
            url: t.FirstURL,
            icon: t.Icon?.URL ? (t.Icon.URL.startsWith('http') ? t.Icon.URL : `https://duckduckgo.com${t.Icon.URL}`) : undefined,
          });
        }
      });
    }

    if (abstract || (heading && relatedTopics.length > 0)) {
      return NextResponse.json({
        found: true,
        heading: heading || q,
        abstract,
        source,
        url,
        image,
        entityType,
        relatedTopics,
      });
    }

    return NextResponse.json({ found: false });
  } catch {
    return NextResponse.json({ found: false });
  }
}
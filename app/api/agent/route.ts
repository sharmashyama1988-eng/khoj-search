import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export interface AgentSearchPayload {
  query: string;
  lang?: string;
  max_results?: number;
  include_summary?: boolean;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || searchParams.get('query') || '';
  const lang = searchParams.get('lang') || 'en';
  const limit = Math.min(parseInt(searchParams.get('max_results') || searchParams.get('limit') || '20', 10), 30);
  const includeSummary = searchParams.get('include_summary') !== 'false';

  return handleAgentSearch(q, lang, limit, includeSummary, req);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AgentSearchPayload;
    const q = body.query || '';
    const lang = body.lang || 'en';
    const limit = Math.min(body.max_results || 20, 30);
    const includeSummary = body.include_summary !== false;

    return handleAgentSearch(q, lang, limit, includeSummary, req);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request payload. Provide { "query": "..." }' }, { status: 400 });
  }
}

async function handleAgentSearch(query: string, lang: string, limit: number, includeSummary: boolean, req: NextRequest) {
  if (!query.trim()) {
    return NextResponse.json({
      status: 'error',
      message: 'Query parameter "q" or JSON field "query" is required.',
      usage: {
        method: 'GET or POST',
        endpoint: '/api/agent?q=<your_query>&max_results=20&include_summary=true',
        frameworks_supported: ['LangChain', 'CrewAI', 'AutoGen', 'LlamaIndex', 'OpenAI Function Calling', 'Custom Agent'],
      },
    }, { status: 400 });
  }

  const origin = req.nextUrl.origin;

  try {
    // 1. Fetch web results
    const webRes = await fetch(`${origin}/api/web?q=${encodeURIComponent(query)}&lang=${lang}&limit=${limit}`);
    const webData = webRes.ok ? await webRes.json() : { results: [] };

    // 2. Fetch Knowledge summary if requested
    let summary: { answer: string; key_points: string[]; source: string } | null = null;
    if (includeSummary) {
      const wikiRes = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json() as { extract?: string; title?: string };
        if (wikiData.extract) {
          const sentences = wikiData.extract.split('. ').filter((s) => s.trim().length > 10);
          summary = {
            answer: wikiData.extract,
            key_points: sentences.slice(0, 4).map((s) => s.endsWith('.') ? s : `${s}.`),
            source: 'Wikipedia & Khoj Knowledge Graph',
          };
        }
      }

      // Fallback summary if Wikipedia doesn't have it
      if (!summary && webData.results?.length > 0) {
        const top3 = webData.results.slice(0, 3);
        const combinedSnippet = top3.map((r: { description: string }) => r.description).join(' ');
        summary = {
          answer: combinedSnippet || `Verified real-time search results synthesized for "${query}".`,
          key_points: top3.map((r: { title: string; domain: string }) => `${r.title} (${r.domain})`),
          source: 'Khoj Multi-Source Synthesizer',
        };
      }
    }

    const communityResults = (webData.results || []).filter((r: { source: string }) => 
      ['Reddit', 'Quora', 'StackOverflow', 'GitHub'].includes(r.source)
    );

    return NextResponse.json({
      status: 'success',
      engine: 'Khoj Agentic Intelligence v2.0',
      query,
      timestamp: new Date().toISOString(),
      ai_summary: summary,
      total_results: webData.results?.length || 0,
      results: webData.results || [],
      community_discussions: communityResults,
      metadata: {
        agent_integration: {
          langchain_tool: {
            name: "khoj_web_search",
            description: "Real-time web search tool returning up to 20 ranked sources with Reddit, StackOverflow, and Wikipedia insights.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "The search query to look up on the live web" },
                max_results: { type: "integer", default: 20 },
              },
              required: ["query"],
            },
          },
        },
      },
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
      query,
    }, { status: 500 });
  }
}

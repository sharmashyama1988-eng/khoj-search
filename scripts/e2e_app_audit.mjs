const BASE_URL = 'https://khoj-dun.vercel.app';

async function auditEndpoint(name, url, validateFn) {
  process.stdout.write(`Testing [${name}] ... `);
  try {
    const start = Date.now();
    const res = await fetch(url, { headers: { 'User-Agent': 'KhojAuditor/2.0' } });
    const duration = Date.now() - start;

    if (!res.ok) {
      console.log(`❌ FAILED (HTTP ${res.status}) in ${duration}ms`);
      return { pass: false, error: `HTTP ${res.status}` };
    }

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else if (contentType.includes('audio/')) {
      data = await res.arrayBuffer();
    } else {
      data = await res.text();
    }

    const validationError = validateFn(data, res);
    if (validationError) {
      console.log(`❌ INVALID DATA: ${validationError} (${duration}ms)`);
      return { pass: false, error: validationError };
    }

    console.log(`✅ PASSED (${duration}ms)`);
    return { pass: true, duration };
  } catch (e) {
    console.log(`❌ EXCEPTION: ${e.message}`);
    return { pass: false, error: e.message };
  }
}

async function runFullAudit() {
  console.log('====================================================');
  console.log('       KHOJ SEARCH ENGINE 360° LIVE AUDIT SUITE      ');
  console.log('====================================================\n');

  const tests = [
    // 1. Homepage & Core Assets
    {
      name: 'Homepage HTML & Meta',
      url: `${BASE_URL}/`,
      validate: (html) => typeof html === 'string' && html.includes('Khoj') ? null : 'Missing title or root elements'
    },
    // 2. Multi-Source Web Search Endpoint
    {
      name: 'Web Search: "python fastapi tutorial"',
      url: `${BASE_URL}/api/web?q=python+fastapi+tutorial&limit=10`,
      validate: (data) => Array.isArray(data.results) && data.results.length >= 3 ? null : 'Too few results'
    },
    {
      name: 'Web Search: "a+b whole square formula"',
      url: `${BASE_URL}/api/web?q=a%2Bb+whole+square+formula&limit=10`,
      validate: (data) => Array.isArray(data.results) && data.results.length >= 3 ? null : 'No math search results'
    },
    {
      name: 'Web Search (Live News RSS): "latest technology news 2026"',
      url: `${BASE_URL}/api/web?q=latest+technology+news+2026&limit=10`,
      validate: (data) => data.results?.some(r => r.badge === '🔴 Live News' || r.badge === 'GitHub' || r.source) ? null : 'No live sources'
    },
    // 3. Real-Time Pricing (RTDT)
    {
      name: 'Price API: "gold price today in india"',
      url: `${BASE_URL}/api/price?q=gold+price+today+in+india`,
      validate: (data) => data.status === 'success' && data.data?.mainPrice ? null : 'Missing price data'
    },
    {
      name: 'Price API: "iphone 16e price"',
      url: `${BASE_URL}/api/price?q=iphone+16e+price`,
      validate: (data) => data.status === 'success' && data.data?.mainPrice ? null : 'Missing iPhone 16e price'
    },
    // 4. Neural Translator API
    {
      name: 'Translate API: English to Hindi ("Knowledge is power")',
      url: `${BASE_URL}/api/translate?text=Knowledge+is+power&to=hi`,
      validate: (data) => data.status === 'success' && data.translatedText ? null : 'Missing translation'
    },
    // 5. OpenRouter Grounded AI Overview
    {
      name: 'AI Overview API: "a+b whole square"',
      url: `${BASE_URL}/api/summary?q=a%2Bb+whole+square&lang=en`,
      validate: (data) => data.status === 'success' && data.extract?.includes('a²') ? null : 'Math formula not synthesized in summary'
    },
    // 6. Custom Edge TTS Streaming Audio
    {
      name: 'TTS Engine: MP3 Streaming Audio',
      url: `${BASE_URL}/api/tts?text=Welcome+to+Khoj+Search+Engine&lang=en`,
      validate: (data) => data.byteLength > 1000 ? null : 'Audio stream empty or truncated'
    },
    // 7. Suggestions API
    {
      name: 'Search Suggestions: "weather"',
      url: `${BASE_URL}/api/suggestions?q=weather&lang=en`,
      validate: (data) => Array.isArray(data.suggestions) && data.suggestions.length > 0 ? null : 'No suggestions returned'
    }
  ];

  let passed = 0;
  for (const t of tests) {
    const result = await auditEndpoint(t.name, t.url, t.validate);
    if (result.pass) passed++;
  }

  console.log('\n====================================================');
  console.log(`  AUDIT COMPLETED: ${passed}/${tests.length} tests passed (${Math.round((passed / tests.length) * 100)}%)`);
  console.log('====================================================\n');
}

runFullAudit();

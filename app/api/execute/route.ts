import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Piston API — free, open source code execution engine
const PISTON_API = 'https://emkc.org/api/v2/piston';

const LANG_ALIASES: Record<string, { language: string; version: string; ext: string }> = {
  python:     { language: 'python',     version: '3.10.0', ext: '.py'  },
  py:         { language: 'python',     version: '3.10.0', ext: '.py'  },
  javascript: { language: 'javascript', version: '18.15.0',ext: '.js'  },
  js:         { language: 'javascript', version: '18.15.0',ext: '.js'  },
  typescript: { language: 'typescript', version: '5.0.3',  ext: '.ts'  },
  ts:         { language: 'typescript', version: '5.0.3',  ext: '.ts'  },
  cpp:        { language: 'c++',        version: '10.2.0', ext: '.cpp' },
  'c++':      { language: 'c++',        version: '10.2.0', ext: '.cpp' },
  c:          { language: 'c',          version: '10.2.0', ext: '.c'   },
  java:       { language: 'java',       version: '15.0.2', ext: '.java'},
  rust:       { language: 'rust',       version: '1.68.2', ext: '.rs'  },
  go:         { language: 'go',         version: '1.20.4', ext: '.go'  },
  ruby:       { language: 'ruby',       version: '3.0.1',  ext: '.rb'  },
  bash:       { language: 'bash',       version: '5.2.0',  ext: '.sh'  },
  lua:        { language: 'lua',        version: '5.4.4',  ext: '.lua' },
  php:        { language: 'php',        version: '8.2.3',  ext: '.php' },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { language: string; code: string; stdin?: string };
    const { language, code, stdin = '' } = body;

    const langInfo = LANG_ALIASES[language.toLowerCase()];
    if (!langInfo) return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });

    const pistonRes = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: langInfo.language,
        version:  langInfo.version,
        files: [{ name: `main${langInfo.ext}`, content: code }],
        stdin,
        run_timeout: 5000,
        compile_timeout: 10000,
      }),
    });

    const result = await pistonRes.json() as {
      run?: { stdout?: string; stderr?: string; code?: number };
      compile?: { stdout?: string; stderr?: string };
      message?: string;
    };

    return NextResponse.json({
      stdout:  result.run?.stdout ?? '',
      stderr:  (result.compile?.stderr ?? '') + (result.run?.stderr ?? ''),
      code:    result.run?.code ?? -1,
      error:   result.message ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

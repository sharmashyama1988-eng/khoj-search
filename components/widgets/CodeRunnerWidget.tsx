'use client';
import { useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

const LANGUAGES = [
  { id: 'python',     label: 'Python',     default: 'print("Hello, World!")\nfor i in range(5):\n    print(f"Number: {i}")' },
  { id: 'javascript', label: 'JavaScript', default: 'console.log("Hello, World!");\nconst arr = [1,2,3,4,5];\nconsole.log(arr.map(x => x * 2));' },
  { id: 'typescript', label: 'TypeScript', default: 'const greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("World"));' },
  { id: 'cpp',        label: 'C++',        default: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { id: 'java',       label: 'Java',       default: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { id: 'rust',       label: 'Rust',       default: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: 'go',         label: 'Go',         default: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
  { id: 'bash',       label: 'Bash',       default: 'echo "Hello, World!"\nfor i in 1 2 3 4 5; do\n  echo "Number: $i"\ndone' },
];

export function CodeRunnerWidget({ initialCode = '' }: { initialCode?: string }) {
  const [lang, setLang]     = useState(LANGUAGES[0].id);
  const [code, setCode]     = useState(initialCode || LANGUAGES[0].default);
  const [stdin, setStdin]   = useState('');
  const [output, setOutput] = useState('');
  const [stderr, setStderr] = useState('');
  const [running, setRunning] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [showStdin, setShowStdin] = useState(false);

  const run = async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput('');
    setStderr('');
    setExitCode(null);
    try {
      const res  = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang, code, stdin }),
      });
      const data = await res.json() as { stdout: string; stderr: string; code: number; error: string | null };
      if (data.error) setStderr(data.error);
      else {
        setOutput(data.stdout);
        setStderr(data.stderr);
        setExitCode(data.code);
      }
    } catch (e) {
      setStderr(String(e));
    } finally {
      setRunning(false);
    }
  };

  const changeLang = (l: string) => {
    setLang(l);
    setCode(LANGUAGES.find((x) => x.id === l)?.default ?? '');
    setOutput('');
    setStderr('');
  };

  return (
    <div className="rounded-xl border border-border bg-surface-2/80 overflow-hidden w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="text-base">💻</span>
        <span className="text-sm font-semibold text-text-primary">Code Runner</span>
        <div className="flex gap-1 ml-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => changeLang(l.id)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-all
                ${lang === l.id ? 'bg-accent text-white' : 'bg-surface-3 text-text-muted hover:text-text-primary'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            // Tab key inserts spaces
            if (e.key === 'Tab') {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end   = e.currentTarget.selectionEnd;
              const newCode = code.substring(0, start) + '  ' + code.substring(end);
              setCode(newCode);
              setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2; }, 0);
            }
            // Ctrl+Enter to run
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
          }}
          className="w-full font-mono text-sm px-4 py-3 bg-[#0d1117] text-[#e6edf3]
            border-none outline-none resize-none min-h-[160px]"
          spellCheck={false}
          placeholder="Write your code here…"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <CopyButton text={code} />
          <span className="text-xs text-[#8b949e] font-mono">Ctrl+Enter to run</span>
        </div>
      </div>

      {/* Stdin toggle */}
      <div className="px-4 py-2 border-t border-border bg-surface-3/50 flex items-center gap-2">
        <button onClick={() => setShowStdin(!showStdin)}
          className="text-xs text-text-muted hover:text-text-primary transition-colors">
          {showStdin ? '▾' : '▸'} stdin input
        </button>
        {showStdin && (
          <input
            type="text"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Program input (stdin)…"
            className="flex-1 text-xs bg-transparent text-text-primary placeholder-text-muted outline-none border-b border-border"
          />
        )}
      </div>

      {/* Run button */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-3">
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-medium
            hover:bg-green-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? (
            <><span className="animate-spin">⟳</span> Running…</>
          ) : (
            <><span>▶</span> Run</>
          )}
        </button>
        {exitCode !== null && (
          <span className={`text-xs font-mono ${exitCode === 0 ? 'text-green-400' : 'text-red-400'}`}>
            Exit: {exitCode}
          </span>
        )}
      </div>

      {/* Output */}
      {(output || stderr) && (
        <div className="border-t border-border">
          {output && (
            <div className="bg-[#0d1117] px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-400 font-mono font-semibold">stdout</span>
                <CopyButton text={output} />
              </div>
              <pre className="text-sm text-[#e6edf3] font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                {output}
              </pre>
            </div>
          )}
          {stderr && (
            <div className="bg-red-950/30 px-4 py-3 border-t border-red-500/20">
              <span className="text-xs text-red-400 font-mono font-semibold">stderr</span>
              <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap break-all mt-1 max-h-32 overflow-y-auto">
                {stderr}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

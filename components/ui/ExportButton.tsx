'use client';
import { useState } from 'react';
import type { SearchResult, ArxivResult, GithubResult, BookResult } from '@/types';

type ExportData = {
  results?: SearchResult[];
  arxiv?: ArxivResult[];
  github?: GithubResult[];
  books?: BookResult[];
  query: string;
};

interface Props { data: ExportData }

export function ExportButton({ data }: Props) {
  const [open, setOpen] = useState(false);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    download(blob, `khoj-${data.query}.json`);
    setOpen(false);
  };

  const exportMarkdown = () => {
    const lines = [
      `# Khoj Search Results: "${data.query}"`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
    ];

    if (data.results?.length) {
      lines.push('## Web Results', '');
      data.results.forEach((r, i) => {
        lines.push(`### ${i + 1}. [${r.title}](${r.url})`);
        lines.push(r.description, '');
      });
    }

    if (data.arxiv?.length) {
      lines.push('## Research Papers', '');
      data.arxiv.forEach((p) => {
        lines.push(`### [${p.title}](${p.url})`);
        lines.push(`*${p.authors.join(', ')}* — ${p.published}`);
        lines.push(p.summary, '');
      });
    }

    if (data.github?.length) {
      lines.push('## GitHub Repositories', '');
      data.github.forEach((r) => {
        lines.push(`### [${r.fullName}](${r.url}) ⭐ ${r.stars}`);
        lines.push(r.description, '');
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    download(blob, `khoj-${data.query}.md`);
    setOpen(false);
  };

  const download = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          bg-surface-2 border border-border text-text-secondary
          hover:bg-surface-3 hover:text-text-primary transition-all"
        title="Export results"
      >
        📤 Export
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-surface border border-border rounded-xl shadow-xl z-50 w-44 animate-slide-up">
          <button onClick={exportMarkdown}
            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors rounded-t-xl">
            📝 Markdown (.md)
          </button>
          <button onClick={exportJSON}
            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors rounded-b-xl border-t border-border">
            📋 JSON (.json)
          </button>
        </div>
      )}
    </div>
  );
}

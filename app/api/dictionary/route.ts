import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Free Dictionary API supports 40+ languages
// https://dictionaryapi.dev/
const SUPPORTED: Record<string, string> = {
  en: 'en', hi: 'hi', es: 'es', fr: 'fr', de: 'de',
  it: 'it', pt: 'pt', ru: 'ru', ar: 'ar', tr: 'tr',
  ja: 'ja', ko: 'ko', zh: 'zh', nl: 'nl', pl: 'pl',
  sv: 'sv', id: 'id', bn: 'bn', ur: 'ur', fa: 'fa',
  el: 'el', cs: 'cs', ro: 'ro', hu: 'hu', uk: 'uk',
  vi: 'vi', th: 'th', da: 'da', fi: 'fi', no: 'no',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get('word') ?? '';
  const lang = searchParams.get('lang') ?? 'en';

  if (!word) return NextResponse.json({ error: 'word required' }, { status: 400 });

  const dictLang = SUPPORTED[lang] ?? 'en';

  try {
    // Primary: Free Dictionary API
    const primaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/${dictLang}/${encodeURIComponent(word.toLowerCase())}`;
    const res = await fetch(primaryUrl, { next: { revalidate: 86400 } });

    if (res.ok) {
      const data = await res.json() as Array<{
        word: string;
        phonetics?: Array<{ text?: string; audio?: string }>;
        meanings?: Array<{
          partOfSpeech: string;
          definitions: Array<{ definition: string; example?: string; synonyms?: string[]; antonyms?: string[] }>;
        }>;
      }>;

      const entry    = data[0];
      const phonetic = entry.phonetics?.find((p) => p.text)?.text;
      const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio;

      return NextResponse.json({
        word:     entry.word,
        phonetic: phonetic ?? null,
        audioUrl: audioUrl ?? null,
        language: dictLang,
        meanings: (entry.meanings ?? []).map((m) => ({
          partOfSpeech: m.partOfSpeech,
          definitions:  m.definitions.slice(0, 5).map((d) => ({
            definition: d.definition,
            example:    d.example ?? null,
            synonyms:   d.synonyms ?? [],
            antonyms:   d.antonyms ?? [],
          })),
        })),
      });
    }

    // Fallback: Wiktionary for languages not in Free Dict API
    const wiktUrl = `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`;
    const wiktRes = await fetch(wiktUrl, { next: { revalidate: 86400 } });
    if (!wiktRes.ok) return NextResponse.json({ error: 'Word not found' }, { status: 404 });

    const wikt = await wiktRes.json() as Record<string, Array<{
      partOfSpeech?: string;
      definitions?: Array<{ definition?: string; examples?: string[] }>;
    }>>;

    const entries = Object.values(wikt).flat();
    return NextResponse.json({
      word,
      phonetic:  null,
      audioUrl:  null,
      language:  dictLang,
      meanings:  entries.slice(0, 3).map((e) => ({
        partOfSpeech: e.partOfSpeech ?? 'unknown',
        definitions:  (e.definitions ?? []).slice(0, 3).map((d) => ({
          definition: (d.definition ?? '').replace(/<[^>]*>/g, ''),
          example:    d.examples?.[0]?.replace(/<[^>]*>/g, '') ?? null,
          synonyms:   [],
          antonyms:   [],
        })),
      })),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

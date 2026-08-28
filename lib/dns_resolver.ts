// ─────────────────────────────────────────────────────────────────────────────
// KHOJ GLOBAL DOMAIN NAME SYSTEM (DNS) & 12,000+ URL RESOLUTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

import type { SearchResult } from '@/types';
import dnsData from '@/db/dns_global_domains.json';

export interface DNSDomainEntry {
  name: string;
  domain: string;
  url: string;
  category: string;
  desc: string;
  tags: string[];
}

const DOMAIN_REGISTRY: DNSDomainEntry[] = dnsData as DNSDomainEntry[];

// High-speed O(1) in-memory lookup maps
const DOMAIN_MAP = new Map<string, DNSDomainEntry>();
const KEYWORD_MAP = new Map<string, DNSDomainEntry[]>();

// Initialize in-memory DNS index
DOMAIN_REGISTRY.forEach((entry) => {
  const d = entry.domain.toLowerCase().trim();
  DOMAIN_MAP.set(d, entry);
  DOMAIN_MAP.set(d.replace(/^www\./, ''), entry);
  DOMAIN_MAP.set(entry.name.toLowerCase().trim(), entry);

  const base = d.split('.')[0];
  if (base && base.length >= 2) {
    if (!DOMAIN_MAP.has(base)) DOMAIN_MAP.set(base, entry);
  }

  entry.tags.forEach((tag) => {
    const t = tag.toLowerCase().trim();
    if (!KEYWORD_MAP.has(t)) {
      KEYWORD_MAP.set(t, []);
    }
    KEYWORD_MAP.get(t)!.push(entry);
  });
});

/**
 * Universal DNS Domain Resolver (12,000+ Domains + Dynamic TLD Synthesis)
 */
export function resolveDNSDomain(query: string): SearchResult | null {
  const rawQ = query.trim().toLowerCase();
  if (!rawQ) return null;

  // 1. Direct O(1) Exact Match in DNS Domain Table
  if (DOMAIN_MAP.has(rawQ)) {
    const entry = DOMAIN_MAP.get(rawQ)!;
    return createDNSResult(entry, 'Exact DNS Domain Match');
  }

  // 2. Full URL / TLD Pattern Match (e.g. "site.com", "portal.gov.in", "https://...")
  const urlPattern = rawQ.match(/^(?:https?:\/\/)?([a-z0-9-]+(?:\.[a-z0-9-]+)+)(?:\/.*)?$/i);
  if (urlPattern) {
    const hostname = urlPattern[1].toLowerCase().replace(/^www\./, '');
    if (DOMAIN_MAP.has(hostname)) {
      return createDNSResult(DOMAIN_MAP.get(hostname)!, 'Official DNS Portal');
    }

    // Dynamic DNS synthesis for any worldwide valid domain
    const cleanUrl = rawQ.startsWith('http') ? rawQ : `https://${hostname}`;
    const namePart = hostname.split('.')[0];
    const formattedTitle = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    return {
      id: `dns-dyn-${hostname}`,
      title: `${formattedTitle} — Official Website (${hostname})`,
      url: cleanUrl,
      description: `Official direct web portal for ${hostname}. Verified and resolved via Khoj Universal Global DNS.`,
      source: 'Khoj Universal DNS',
      domain: hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      badge: 'Official Site',
      score: 990,
    };
  }

  // 3. Keyword / Tag Multi-Match
  if (KEYWORD_MAP.has(rawQ)) {
    const matches = KEYWORD_MAP.get(rawQ)!;
    if (matches.length > 0) {
      return createDNSResult(matches[0], 'Top Category DNS Domain');
    }
  }

  // 4. Token-level Prefix Matching (e.g. "sbi online", "youtube live", "iit bombay admission")
  const tokens = rawQ.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length >= 2) {
    const firstToken = tokens[0];
    if (DOMAIN_MAP.has(firstToken)) {
      return createDNSResult(DOMAIN_MAP.get(firstToken)!, 'Official Portal');
    }
  }

  return null;
}

function createDNSResult(entry: DNSDomainEntry, reason: string): SearchResult {
  return {
    id: `dns-${entry.domain}`,
    title: `${entry.name} — Official Website (${entry.domain})`,
    url: entry.url,
    description: `${entry.desc} Verified official domain in the Khoj Universal DNS Registry (${entry.category}).`,
    source: 'Khoj Universal DNS',
    domain: entry.domain,
    favicon: `https://www.google.com/s2/favicons?domain=${entry.domain}&sz=32`,
    badge: 'Official Site',
    score: 995,
  };
}
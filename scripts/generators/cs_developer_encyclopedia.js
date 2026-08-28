const { saveDb } = require('../db_helper.js');

const csEntries = [
  {
    id: 'cs-trie-prefix-tree',
    keywords: ['trie data structure prefix tree', 'trie insert search autocomplete complexity', 'radix tree patricia tree', 'trie leetcode'],
    title: 'Trie (Prefix Tree) — Autocomplete & Prefix Matching',
    category: 'Computer Science',
    answer: 'A Trie (Prefix Tree) is a specialized multi-way tree data structure used for storing strings where each node represents a character. It provides optimal O(L) time complexity for insert, search, and prefix matching (where L is the key length), completely independent of the total number of stored keys N.',
    highlights: [
      'Time Complexity: Insert O(L), Search O(L), Prefix Search O(L) where L is string length',
      'Space Complexity: O(ALPHABET_SIZE × L × N) where ALPHABET_SIZE is typically 26 (lowercase English)',
      'Primary Applications: Search engine autocomplete, spell checkers, IP routing longest prefix match (CIDR), dictionary lookups',
      'Compressed Trie (Radix Tree / Patricia Tree) merges single-child nodes to reduce memory footprint drastically'
    ],
    url: 'https://en.wikipedia.org/wiki/Trie'
  },
  {
    id: 'cs-segment-tree-fenwick-bit',
    keywords: ['segment tree vs fenwick tree binary indexed tree', 'range query point update complexity', 'segment tree lazy propagation', 'range minimum query rmq'],
    title: 'Segment Tree and Fenwick Tree (Binary Indexed Tree)',
    category: 'Computer Science',
    answer: 'Segment Trees and Fenwick Trees (BIT) are data structures designed for fast range queries (sum, minimum, maximum, GCD) and point/range updates in O(log N) time on arrays. Segment Trees support arbitrary associative functions with Lazy Propagation for O(log N) range updates, while Fenwick Trees use bitwise least significant bit (LSB = x & -x) operations with minimal O(N) space.',
    highlights: [
      'Segment Tree: Build O(N), Range Query O(log N), Point Update O(log N), Range Update with Lazy Propagation O(log N)',
      'Fenwick Tree (BIT): Build O(N), Prefix Sum Query O(log N), Point Update O(log N); space is strictly 1× array size',
      'Fenwick Tree index step: Parent to child uses `i += (i & -i)` for update, and `i -= (i & -i)` for query',
      'Essential for competitive programming, computational geometry, spatial data indexing, and dynamic statistical rankings'
    ],
    url: 'https://en.wikipedia.org/wiki/Segment_tree'
  },
  {
    id: 'cs-disjoint-set-union-dsu',
    keywords: ['disjoint set union dsu union find', 'path compression union by rank complexity', 'inverse ackermann function alpha n', 'kruskal algorithm dsu'],
    title: 'Disjoint Set Union (DSU / Union-Find) Data Structure',
    category: 'Computer Science',
    answer: 'Disjoint Set Union (Union-Find) maintains a collection of disjoint dynamic sets supporting two primary operations: `find(x)` (identifies set representative) and `union(x, y)` (merges two sets). Utilizing Path Compression and Union by Rank/Size, the amortized time complexity per operation is nearly constant O(α(N)), where α is the extremely slow-growing Inverse Ackermann function (α(10⁸⁰) < 5).',
    highlights: [
      'Amortized Time Complexity: O(α(N)) ≈ O(1) per operation with Path Compression + Union by Rank',
      'Path Compression: Points every visited node directly to the root during `find(x)` traversal: `parent[x] = find(parent[x])`',
      'Union by Rank/Size: Attaches the shallower/smaller tree under the root of the deeper/larger tree',
      'Core use cases: Kruskal\'s Minimum Spanning Tree algorithm, cycle detection in undirected graphs, dynamic connected components'
    ],
    url: 'https://en.wikipedia.org/wiki/Disjoint-set_data_structure'
  },
  {
    id: 'cs-dynamic-programming-patterns',
    keywords: ['dynamic programming patterns leetcode', '0 1 knapsack longest common subsequence lcs', 'kadane algorithm maximum subarray sum', 'memoization vs tabulation'],
    title: 'Core Dynamic Programming (DP) Patterns & Algorithms',
    category: 'Computer Science',
    answer: 'Dynamic Programming solves complex problems by breaking them into overlapping subproblems with optimal substructure using either Top-Down Memoization (recursion + cache) or Bottom-Up Tabulation (iterative table building). Core patterns include: (1) 0/1 Knapsack, (2) Longest Common Subsequence (LCS), (3) Longest Increasing Subsequence (LIS in O(N log N) via patience sorting), and (4) Kadane\'s Algorithm for Maximum Subarray Sum in O(N) time.',
    highlights: [
      'Kadane\'s Algorithm (Max Subarray Sum): `current_max = max(arr[i], current_max + arr[i])` in O(N) time and O(1) space',
      '0/1 Knapsack: DP table `dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])` in O(N × W) time',
      'Longest Common Subsequence (LCS): `if (s1[i]==s2[j]) dp[i][j] = 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1])`',
      'Longest Increasing Subsequence (LIS): Solvable in O(N log N) time using binary search (std::lower_bound) over tails array'
    ],
    url: 'https://en.wikipedia.org/wiki/Dynamic_programming'
  },
  {
    id: 'cs-system-design-caching-rate-limiting',
    keywords: ['system design caching strategies', 'write through write back cache aside', 'rate limiting token bucket leaky bucket', 'consistent hashing distributed cache'],
    title: 'System Design — Caching Strategies & Rate Limiting Algorithms',
    category: 'Computer Science',
    answer: 'In high-scale distributed systems, Caching reduces database load and latency across three patterns: (1) Cache-Aside (App queries cache first, reads DB on miss and writes to cache), (2) Write-Through (App writes to cache, cache writes to DB synchronously), (3) Write-Back (App writes to cache, cache flushes asynchronously to DB). Rate Limiting prevents abuse using Token Bucket (allows bursts), Leaky Bucket (smooth constant outflow), Fixed Window, or Sliding Window Log.',
    highlights: [
      'Cache-Aside: Most popular general pattern; resilient to cache node failures',
      'Write-Through: High data consistency; higher write latency since DB write must complete',
      'Write-Back (Write-Behind): Ultra-low write latency; risk of data loss if cache crashes before flushing to DB',
      'Token Bucket Algorithm: Tokens added at constant rate; request consumes token; supports controlled bursts (used in AWS API Gateway, NGINX)',
      'Consistent Hashing: Maps keys and nodes to a circular hash ring (0 to 2³²-1) with virtual nodes to minimize remapping during node scale out/in'
    ],
    url: 'https://en.wikipedia.org/wiki/Cache_(computing)'
  },
  {
    id: 'cs-nextjs-rendering-ssr-ssg-isr',
    keywords: ['nextjs rendering methods ssr ssg isr rsc', 'server side rendering vs static site generation', 'incremental static regeneration nextjs', 'react server components rsc'],
    title: 'Next.js Rendering Modes — SSR, SSG, ISR, and React Server Components',
    category: 'Computer Science',
    answer: 'Next.js supports four rendering paradigms: (1) Static Site Generation (SSG: HTML generated at build time via `generateStaticParams`), (2) Server-Side Rendering (SSR: HTML rendered per request on Edge/Node runtime), (3) Incremental Static Regeneration (ISR: revalidates static pages in background on-demand via `revalidate`), and (4) React Server Components (RSC in App Router: components render strictly on server with zero bundle weight on client).',
    highlights: [
      'Static Site Generation (SSG): Fastest TTFB (Time to First Byte); served instantly from global CDN edges',
      'Server-Side Rendering (SSR): Ideal for real-time user-personalized data; higher server compute overhead per request',
      'Incremental Static Regeneration (ISR): Combines speed of SSG with freshness of SSR using stale-while-revalidate caching',
      'React Server Components (RSC): Default in Next.js App Router; fetch data directly on server without sending JS dependencies to client browser',
      'Client Components (`"use client"`): Required only for browser interactivity (state `useState`, effects `useEffect`, event listeners `onClick`)'
    ],
    url: 'https://en.wikipedia.org/wiki/Next.js'
  }
];

saveDb('computer_science_advanced.json', csEntries);
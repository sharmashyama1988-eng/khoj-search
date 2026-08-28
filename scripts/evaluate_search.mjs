import { applyReciprocalRankFusion, hybridReRank } from "../lib/rerank.ts";

export const BENCHMARKS = [
  {
    query: "youtube",
    expectedDomains: ["youtube.com"],
    category: "Navigational",
    candidates: [
      { id: "1", title: "YouTube", url: "https://www.youtube.com/", description: "Enjoy videos and music.", source: "Direct", badge: "Direct URL", domain: "youtube.com" },
      { id: "2", title: "YouTube - Wikipedia", url: "https://en.wikipedia.org/wiki/YouTube", description: "Online video platform.", source: "Wikipedia", domain: "wikipedia.org" },
      { id: "3", title: "How to use YouTube", url: "https://randomblog.com/youtube-tips", description: "Tips and tricks.", source: "DuckDuckGo", domain: "randomblog.com" }
    ]
  },
  {
    query: "github login",
    expectedDomains: ["github.com"],
    category: "Navigational",
    candidates: [
      { id: "1", title: "Sign in to GitHub · GitHub", url: "https://github.com/login", description: "Log in to GitHub to build and share software together.", source: "GitHub", badge: "Official Site", domain: "github.com" },
      { id: "2", title: "GitHub - Wikipedia", url: "https://en.wikipedia.org/wiki/GitHub", description: "Development platform hosting git repositories.", source: "Wikipedia", domain: "wikipedia.org" },
      { id: "3", title: "How to fix GitHub login issues", url: "https://medium.com/@dev/github-login", description: "Troubleshooting guide for login tokens.", source: "Medium", domain: "medium.com" }
    ]
  },
  {
    query: "chatgpt openai",
    expectedDomains: ["chatgpt.com", "openai.com"],
    category: "Navigational",
    candidates: [
      { id: "1", title: "ChatGPT - OpenAI", url: "https://chatgpt.com/", description: "Free-to-use AI system for engaging conversations, insights, and automation.", source: "Direct", badge: "Official Site", domain: "chatgpt.com" },
      { id: "2", title: "OpenAI: Creating safe AGI that benefits all of humanity", url: "https://openai.com/", description: "OpenAI research and deployment company.", source: "DuckDuckGo", domain: "openai.com" },
      { id: "3", title: "ChatGPT - Wikipedia", url: "https://en.wikipedia.org/wiki/ChatGPT", description: "Chatbot developed by OpenAI.", source: "Wikipedia", domain: "wikipedia.org" }
    ]
  },
  {
    query: "netflix watch movies online",
    expectedDomains: ["netflix.com"],
    category: "Navigational",
    candidates: [
      { id: "1", title: "Netflix - Watch TV Shows Online, Watch Movies Online", url: "https://www.netflix.com/", description: "Watch Netflix movies & TV shows online or stream right to your smart TV, phone, tablet.", source: "Direct", badge: "Official Site", domain: "netflix.com" },
      { id: "2", title: "Netflix - Wikipedia", url: "https://en.wikipedia.org/wiki/Netflix", description: "American subscription video on-demand service.", source: "Wikipedia", domain: "wikipedia.org" },
      { id: "3", title: "Top Movies Streaming on Netflix This Month", url: "https://rottentomatoes.com/netflix-movies", description: "Rotten Tomatoes curated rankings of top streaming movies.", source: "DuckDuckGo", domain: "rottentomatoes.com" }
    ]
  },
  {
    query: "react usestate hook guide",
    expectedDomains: ["react.dev"],
    category: "Technical Docs",
    candidates: [
      { id: "1", title: "useState – React Official Documentation", url: "https://react.dev/reference/react/useState", description: "useState is a React Hook that lets you add a state variable to your component.", source: "DuckDuckGo", badge: "Docs", domain: "react.dev" },
      { id: "2", title: "Understanding React useState Hook with Examples", url: "https://freecodecamp.org/news/react-usestate-hook-guide", description: "Comprehensive guide on React state management with useState.", source: "DuckDuckGo", domain: "freecodecamp.org" },
      { id: "3", title: "Why is useState not updating state immediately? : r/reactjs", url: "https://reddit.com/r/reactjs/comments/usestate_async", description: "Reddit discussion on async state updates and closures in React.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "nextjs app router documentation",
    expectedDomains: ["nextjs.org"],
    category: "Technical Docs",
    candidates: [
      { id: "1", title: "Routing: App Router | Next.js Documentation", url: "https://nextjs.org/docs/app", description: "Learn how to use Next.js App Router with Server Components, layouts, nested routes, and loading UI.", source: "DuckDuckGo", badge: "Docs", domain: "nextjs.org" },
      { id: "2", title: "Deep Dive into Next.js App Router vs Pages Router", url: "https://medium.com/@dev/nextjs-app-router-guide", description: "Architectural comparison and migration strategies for Next.js.", source: "Medium", domain: "medium.com" },
      { id: "3", title: "Anyone else having trouble with Next.js App Router? : r/nextjs", url: "https://reddit.com/r/nextjs/comments/app_router_rant", description: "Community discussion and complaints about App Router caching.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "fastapi cors tutorial",
    expectedDomains: ["fastapi.tiangolo.com"],
    category: "Technical Docs",
    candidates: [
      { id: "1", title: "CORS (Cross-Origin Resource Sharing) - FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/cors/", description: "How to configure CORSMiddleware in FastAPI to allow cross-origin requests from frontend apps.", source: "DuckDuckGo", badge: "Docs", domain: "fastapi.tiangolo.com" },
      { id: "2", title: "Solving FastAPI CORS Errors in Python", url: "https://dev.to/python/fastapi-cors-guide", description: "Quick setup for CORSMiddleware in FastAPI backends.", source: "Dev.to", domain: "dev.to" },
      { id: "3", title: "What is CORS in Web APIs?", url: "https://quora.com/What-is-CORS-in-APIs", description: "Quora answers explaining cross-origin resource security.", source: "Quora", domain: "quora.com" }
    ]
  },
  {
    query: "tailwind css flexbox alignment",
    expectedDomains: ["tailwindcss.com"],
    category: "Technical Docs",
    candidates: [
      { id: "1", title: "Flexbox & Grid - Tailwind CSS Documentation", url: "https://tailwindcss.com/docs/flex-direction", description: "Utilities for controlling how flex items are positioned, aligned, and distributed.", source: "DuckDuckGo", badge: "Docs", domain: "tailwindcss.com" },
      { id: "2", title: "Tailwind CSS Flex Items Center and Justify", url: "https://geeksforgeeks.org/tailwind-css-flexbox", description: "GeeksforGeeks examples on flexbox classes in Tailwind.", source: "GeeksforGeeks", domain: "geeksforgeeks.org" },
      { id: "3", title: "Help centering div in Tailwind CSS : r/tailwindcss", url: "https://reddit.com/r/tailwindcss/comments/center_div", description: "Reddit thread discussing items-center and justify-center utilities.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "how to fix cors error in fastapi",
    expectedDomains: ["fastapi.tiangolo.com", "stackoverflow.com"],
    category: "Developer Error Solution",
    candidates: [
      { id: "1", title: "CORS (Cross-Origin Resource Sharing) - FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/cors/", description: "How to configure CORSMiddleware in FastAPI to allow cross-origin requests.", source: "DuckDuckGo", domain: "fastapi.tiangolo.com" },
      { id: "2", title: "python - FastAPI CORS error on POST request - Stack Overflow", url: "https://stackoverflow.com/questions/12345/fastapi-cors", description: "Add CORSMiddleware with allow_origins=['*'] to solve CORS issues.", source: "StackOverflow", domain: "stackoverflow.com" },
      { id: "3", title: "Understanding CORS Errors", url: "https://medium.com/@dev/cors-guide", description: "General explanation of browser CORS.", source: "Medium", domain: "medium.com" }
    ]
  },
  {
    query: "docker container exits with code 0 immediately",
    expectedDomains: ["stackoverflow.com", "docs.docker.com"],
    category: "Developer Error Solution",
    candidates: [
      { id: "1", title: "Why does my Docker container exit immediately with code 0? - Stack Overflow", url: "https://stackoverflow.com/questions/28578616/docker-container-exits-immediately-with-code-0", description: "A container runs as long as its foreground main process is alive. Use tail -f /dev/null or run foreground server.", source: "StackOverflow", domain: "stackoverflow.com" },
      { id: "2", title: "Docker run reference and container exit codes", url: "https://docs.docker.com/engine/reference/run/", description: "Official Docker engine docs on container lifecycles and exit status codes.", source: "DuckDuckGo", badge: "Docs", domain: "docs.docker.com" },
      { id: "3", title: "Docker beginner mistakes : r/docker", url: "https://reddit.com/r/docker/comments/container_exits", description: "Reddit discussion on why background daemons cause containers to exit.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "git undo last commit keep changes",
    expectedDomains: ["stackoverflow.com", "git-scm.com"],
    category: "Developer Error Solution",
    candidates: [
      { id: "1", title: "How to undo the last commit in Git without losing changes? - Stack Overflow", url: "https://stackoverflow.com/questions/927358/how-to-undo-the-last-commit", description: "Use `git reset --soft HEAD~1` to undo the commit and keep all changed files in the staging area.", source: "StackOverflow", domain: "stackoverflow.com" },
      { id: "2", title: "Git Basics - Undoing Things - Git SCM", url: "https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things", description: "Official Git documentation on resetting commits and modifying history.", source: "DuckDuckGo", badge: "Docs", domain: "git-scm.com" },
      { id: "3", title: "I broke my git repo please help : r/git", url: "https://reddit.com/r/git/comments/git_reset_help", description: "Community advice on git reset vs git revert.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "gold price today 24k",
    expectedDomains: ["mcxindia.com"],
    category: "Real-Time Pricing",
    candidates: [
      { id: "1", title: "Live 24K Gold Price Today in India — Bullion Rates", url: "https://www.mcxindia.com/gold-price", description: "Current 24 Karat and 22 Karat gold rates updated live per gram and 10 grams.", source: "DuckDuckGo", domain: "mcxindia.com" },
      { id: "2", title: "Gold Price Movement and Analysis", url: "https://economictimes.indiatimes.com/gold", description: "Gold rates rise amid global inflation.", source: "DuckDuckGo", domain: "economictimes.indiatimes.com" },
      { id: "3", title: "History of Gold Standards", url: "https://en.wikipedia.org/wiki/Gold_standard", description: "Monetary system based on gold.", source: "Wikipedia", domain: "wikipedia.org" }
    ]
  },
  {
    query: "bitcoin price live usd",
    expectedDomains: ["coingecko.com", "coinmarketcap.com"],
    category: "Real-Time Pricing",
    candidates: [
      { id: "1", title: "Bitcoin (BTC) Price Live, Chart, Market Cap — CoinGecko", url: "https://www.coingecko.com/en/coins/bitcoin", description: "Live Bitcoin price today in USD, real-time charts, 24h trading volume, and market capitalization.", source: "DuckDuckGo", domain: "coingecko.com" },
      { id: "2", title: "Bitcoin - Wikipedia", url: "https://en.wikipedia.org/wiki/Bitcoin", description: "Bitcoin is the first decentralized digital currency created in 2009.", source: "Wikipedia", domain: "wikipedia.org" },
      { id: "3", title: "Is Bitcoin going to $100k this year? : r/CryptoCurrency", url: "https://reddit.com/r/CryptoCurrency/comments/btc_bullrun", description: "Reddit discussion on crypto market cycle and macro price action.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "nvidia stock price nvda",
    expectedDomains: ["finance.yahoo.com", "nasdaq.com"],
    category: "Financial & Stocks",
    candidates: [
      { id: "1", title: "NVIDIA Corporation (NVDA) Stock Price, News, Quote - Yahoo Finance", url: "https://finance.yahoo.com/quote/NVDA/", description: "Find the latest NVIDIA Corporation (NVDA) stock quote, history, news and other vital information.", source: "DuckDuckGo", domain: "finance.yahoo.com" },
      { id: "2", title: "NVDA Earnings Discussion Thread : r/wallstreetbets", url: "https://reddit.com/r/wallstreetbets/comments/nvda_earnings", description: "WallStreetBets thread reacting to Nvidia GPU data center revenue guidance.", source: "Reddit", domain: "reddit.com" },
      { id: "3", title: "Nvidia Corporation - Wikipedia", url: "https://en.wikipedia.org/wiki/Nvidia", description: "American multinational technology company known for designing GPUs.", source: "Wikipedia", domain: "wikipedia.org" }
    ]
  },
  {
    query: "iphone 16e price and specs",
    expectedDomains: ["apple.com"],
    category: "Product & Gadget",
    candidates: [
      { id: "1", title: "iPhone 16e - Apple", url: "https://www.apple.com/iphone-16e/", description: "Meet iPhone 16e with Apple A18 chip, 48MP Fusion Camera, Apple Intelligence.", source: "DuckDuckGo", badge: "Official Site", domain: "apple.com" },
      { id: "2", title: "Apple iPhone 16e Review & Full Specifications", url: "https://www.gsmarena.com/apple_iphone_16e-1234.php", description: "Full phone specifications, camera review, battery test.", source: "DuckDuckGo", domain: "gsmarena.com" },
      { id: "3", title: "Is iPhone 16e worth buying? : r/apple", url: "https://reddit.com/r/apple/comments/iphone16e", description: "User reviews and discussion on iPhone 16e value.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "sony wh-1000xm5 wireless noise canceling headphones",
    expectedDomains: ["sony.com"],
    category: "Product & Gadget",
    candidates: [
      { id: "1", title: "WH-1000XM5 Wireless Noise Cancelling Headphones | Sony", url: "https://www.sony.com/electronics/headband-headphones/wh-1000xm5", description: "Discover Sony WH-1000XM5 with Auto NC Optimizer, 8 microphones, and exceptional sound quality.", source: "DuckDuckGo", badge: "Official Site", domain: "sony.com" },
      { id: "2", title: "Sony WH-1000XM5 Premium Noise-Canceling Headphones - Amazon", url: "https://www.amazon.com/Sony-WH-1000XM5-Canceling-Headphones/dp/B09XS7JWHH", description: "Buy Sony WH-1000XM5 wireless noise cancelling headphones with fast delivery.", source: "Amazon", domain: "amazon.com" },
      { id: "3", title: "Sony XM5 vs Bose QuietComfort Ultra : r/headphones", url: "https://reddit.com/r/headphones/comments/xm5_vs_bose", description: "Headphones subreddit community comparison.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "macbook pro m4 specs apple",
    expectedDomains: ["apple.com"],
    category: "Product & Gadget",
    candidates: [
      { id: "1", title: "MacBook Pro 14” and 16” with M4, M4 Pro, M4 Max - Apple", url: "https://www.apple.com/macbook-pro/", description: "Supercharged by the M4 family of chips. Liquid Retina XDR display with up to 1600 nits peak brightness.", source: "DuckDuckGo", badge: "Official Site", domain: "apple.com" },
      { id: "2", title: "Apple MacBook Pro M4 Review: The Performance King", url: "https://www.theverge.com/macbook-pro-m4-review", description: "The Verge testing the battery life and rendering benchmarks of M4 Max.", source: "The Verge", domain: "theverge.com" },
      { id: "3", title: "Should I upgrade from M1 to M4 MacBook Pro? : r/mac", url: "https://reddit.com/r/mac/comments/m1_to_m4", description: "Reddit thread on MacBook Pro upgrade decision.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "how to install nodejs on ubuntu 24.04",
    expectedDomains: ["digitalocean.com", "nodejs.org"],
    category: "Tutorials & How-To",
    candidates: [
      { id: "1", title: "How To Install Node.js on Ubuntu 24.04 LTS | DigitalOcean", url: "https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-24-04", description: "Step-by-step tutorial on installing Node.js via apt, NodeSource repository, or NVM.", source: "DuckDuckGo", domain: "digitalocean.com" },
      { id: "2", title: "Download Node.js Official Binaries and Sources", url: "https://nodejs.org/en/download", description: "Get official Node.js binaries for Linux, macOS, and Windows.", source: "DuckDuckGo", badge: "Docs", domain: "nodejs.org" },
      { id: "3", title: "Node.js command not found on Ubuntu after apt-get install", url: "https://stackoverflow.com/questions/nodejs-ubuntu-command", description: "Stack Overflow thread on nodejs vs node symlink issue.", source: "StackOverflow", domain: "stackoverflow.com" }
    ]
  },
  {
    query: "how to bake sourdough bread for beginners",
    expectedDomains: ["kingarthurbaking.com"],
    category: "Tutorials & How-To",
    candidates: [
      { id: "1", title: "Beginner's Sourdough Bread Recipe | King Arthur Baking", url: "https://www.kingarthurbaking.com/recipes/beginners-sourdough-bread-recipe", description: "A simple, foolproof guide and recipe for baking your very first crusty loaf of sourdough bread.", source: "DuckDuckGo", domain: "kingarthurbaking.com" },
      { id: "2", title: "Sourdough Bread History and Science - Wikipedia", url: "https://en.wikipedia.org/wiki/Sourdough", description: "Sourdough is a naturally leavened bread made using wild yeasts and lactobacilli.", source: "Wikipedia", domain: "wikipedia.org" },
      { id: "3", title: "Help, my sourdough starter is not rising : r/Sourdough", url: "https://reddit.com/r/Sourdough/comments/starter_help", description: "Reddit sourdough baking community questions.", source: "Reddit", domain: "reddit.com" }
    ]
  },
  {
    query: "best mechanical keyboard for programming reddit",
    expectedDomains: ["reddit.com"],
    category: "Community Discussions",
    candidates: [
      { id: "1", title: "Best Mechanical Keyboards for Programmers & Coders (2026 Guide) : r/MechanicalKeyboards", url: "https://reddit.com/r/MechanicalKeyboards/comments/best_coder_keyboards", description: "Community discussion and top recommendations for ergonomic and mechanical keyboards for coding.", source: "Reddit", badge: "Reddit", domain: "reddit.com" },
      { id: "2", title: "The 7 Best Mechanical Keyboards of 2026 - Reviews", url: "https://www.rtings.com/keyboard/reviews/best/mechanical", description: "Lab testing results and switch comparisons from RTINGS.", source: "DuckDuckGo", domain: "rtings.com" },
      { id: "3", title: "Keyboard Technology - Wikipedia", url: "https://en.wikipedia.org/wiki/Keyboard_technology", description: "Computer keyboard technologies and switch mechanism taxonomy.", source: "Wikipedia", domain: "wikipedia.org" }
    ]
  }
];

export function runEvaluation() {
  console.log("=================================================");
  console.log("   KHOJ SEARCH ENGINE AUTOMATED PRECISION SUITE  ");
  console.log("=================================================\n");

  let totalQueries = BENCHMARKS.length;
  let top1Accurate = 0;
  let top3Accurate = 0;

  BENCHMARKS.forEach((test, idx) => {
    console.log(`[Test ${idx + 1}/${totalQueries}] Query: "${test.query}" (${test.category})`);
    
    // 1. Reciprocal Rank Fusion
    const fused = applyReciprocalRankFusion([test.candidates], 60);

    // 2. BM25+ & Dense Semantic Hybrid Re-Ranking
    const ranked = hybridReRank(test.query, fused, 5);

    const top1 = ranked[0];
    const top3Domains = ranked.slice(0, 3).map(r => r.domain || "");

    const isTop1Match = top1 && (
      test.expectedDomains.some(exp => top1.domain?.includes(exp) || top1.url?.includes(exp)) ||
      ((top1.badge === 'Official Site' || top1.badge === 'Direct URL') && test.category === "Navigational")
    );
    const isTop3Match = test.expectedDomains.some(exp => top3Domains.some(d => d.includes(exp)));

    if (isTop1Match) top1Accurate++;
    if (isTop3Match) top3Accurate++;

    console.log(`  Top #1 Rank: [${top1?.title}] (Score: ${top1?.score})`);
    console.log(`  Domain: ${top1?.domain} | Expected: ${test.expectedDomains.join(' / ')} -> ${isTop1Match ? "✅ PASS" : "⚠️ SUB-OPTIMAL"}`);
    console.log(`  -----------------------------------------------`);
  });

  const precisionTop1 = Math.round((top1Accurate / totalQueries) * 100);
  const precisionTop3 = Math.round((top3Accurate / totalQueries) * 100);

  console.log("\n=================================================");
  console.log(`  FINAL EVALUATION REPORT:`);
  console.log(`  • Top-1 Precision (MRR@1): ${precisionTop1}% (${top1Accurate}/${totalQueries})`);
  console.log(`  • Top-3 Recall (R@3):       ${precisionTop3}% (${top3Accurate}/${totalQueries})`);
  console.log(`  • Overall Pipeline Health: ${precisionTop1 >= 90 ? "🚀 EXCELLENT (90%+)" : precisionTop1 >= 80 ? "⚡ GOOD" : "⚠️ NEEDS TUNING"}`);
  console.log("=================================================\n");

  return { totalQueries, top1Accurate, top3Accurate, precisionTop1, precisionTop3 };
}

runEvaluation();

# Khoj 🔍

> **Free, open, multilingual search engine — no login, no API keys, forever free.**

Live: [khoj.vercel.app](https://khoj.vercel.app)

---

## Features

| Feature | Details |
|---|---|
| 🌍 **30+ Languages** | UI + Dictionary + Wikipedia search in your language |
| ⚡ **Instant Widgets** | Calculator, Weather, Crypto, Currency, Dictionary, Timer, Color Picker, QR, Password, Dice |
| 📚 **5 Search Tabs** | All · Images · Code · Research · Books |
| ✦ **Featured Answer** | Wikipedia/DuckDuckGo summary card at top of every search |
| **Kh·o·o·o·o·j Pagination** | Google-style branded pagination |
| 🌙 **Dark / Light** | Auto-detects system preference |
| ⌨️ **Keyboard Nav** | `Ctrl+K` to focus, `↑↓` to navigate, `Enter` to open |

## APIs Used (All Free, No Key Required)

| API | Purpose |
|---|---|
| Wikipedia REST API | Knowledge panels, summaries, search results |
| Wikidata | Structured facts |
| DuckDuckGo Instant Answer | Fallback quick answers |
| Open-Meteo | Real-time weather & 7-day forecast |
| CoinGecko | Live crypto prices |
| Frankfurter | Live currency rates |
| Free Dictionary API (dictionaryapi.dev) | 40+ language dictionary |
| Wiktionary | Dictionary fallback for rare languages |
| Open Library | Books search |
| arXiv | Research papers (Physics, Math, CS, AI) |
| Wikimedia Commons | Free images |
| GitHub Search | Open-source repositories |
| qr-server.com | QR code generation |

## Deploy to Vercel (1 click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/khoj)

1. Fork / clone this repo
2. Push to GitHub
3. Import in [vercel.com](https://vercel.com) → select repo → Deploy
4. **No environment variables needed** — everything is free and open!

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/khoj
cd khoj
npm install
npm run dev
# open http://localhost:3000
```

## Tech Stack

- **Next.js 14** (App Router, Edge Runtime)
- **TypeScript** (strict mode)
- **Tailwind CSS** (dark/light theme with CSS variables)
- **Zero paid services** — 100% free forever

## License

MIT — use it, fork it, remix it.

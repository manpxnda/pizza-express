# Pizza Express

Modern marketing & online-ordering website for **Pizza Express** — a locally owned
pizzeria with fresh dough made daily and everything made-to-order.

Three locations: **Warwood** (Wheeling, WV), **Bridgeport, OH**, and **Yorkville, OH**.

The site's #1 job is to make ordering effortless: pick a location, then **Order Online**
(EatOnTheWeb) or **tap to call**. Live "open / closed" status is computed in Eastern time
per location.

## Tech

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- Deployed on [Vercel](https://vercel.com)

Brand colors are sampled directly from the logo: red `#e11b22`, green `#2f7d16`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing content

All locations, hours, phone numbers and the full menu live in
[`app/lib/data.ts`](app/lib/data.ts) — edit there and everything updates across the site.
Online-ordering links point at each location's EatOnTheWeb store.

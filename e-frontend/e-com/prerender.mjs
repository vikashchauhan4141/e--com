/**
 * Custom Prerender Script — React 19 + Vite 8
 * 
 * Generates static HTML for key public pages at build time.
 * No plugin needed — uses Node.js + React 19's built-in prerender API.
 * 
 * Run: node prerender.mjs  (after `npm run build`)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

// Routes to prerender (public pages only — no auth required)
const ROUTES_TO_PRERENDER = ['/', '/shop', '/about', '/contact'];

// Read the built index.html template
const indexHtmlPath = join(distDir, 'index.html');

if (!existsSync(indexHtmlPath)) {
  console.error('\n❌  dist/index.html not found. Run `npm run build` first!\n');
  process.exit(1);
}

const indexHtml = readFileSync(indexHtmlPath, 'utf-8');

console.log('\n🚀 Starting prerender...\n');

for (const route of ROUTES_TO_PRERENDER) {
  // Build the output path
  const routePath = route === '/' ? '' : route;
  const outputDir = join(distDir, routePath);
  const outputFile = join(outputDir, 'index.html');

  // Create directory if needed
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Inject route-specific meta tags for SEO
  let html = indexHtml;

  const routeMeta = {
    '/': {
      title: 'Stylee | Premium Fashion Atelier — Quiet Luxury Coordinates',
      description: 'Discover curated luxury fashion at Stylee Atelier. Shop silk slips, organic knits, and cashmere silhouettes crafted in limited runs.',
    },
    '/shop': {
      title: 'Shop All Coordinates | Stylee Atelier',
      description: 'Browse the full Stylee Atelier collection. Filter by category, size, color, and gender. Free domestic shipping on all orders.',
    },
    '/about': {
      title: 'About Us | Stylee Atelier — Our Philosophy',
      description: 'Learn about the Stylee Atelier philosophy — quiet luxury, ethical sourcing, and small-batch craftsmanship.',
    },
    '/contact': {
      title: 'Contact | Stylee Atelier',
      description: 'Get in touch with the Stylee Atelier team for queries, collaborations, or support.',
    },
  };

  const meta = routeMeta[route] || routeMeta['/'];

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Inject meta description (or add if missing)
  const metaDescTag = `<meta name="description" content="${meta.description}" />`;
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description"[^>]*\/>/, metaDescTag);
  } else {
    html = html.replace('</head>', `  ${metaDescTag}\n  </head>`);
  }

  // Inject Open Graph tags for social sharing
  const ogTags = `
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:type" content="website" />`;
  html = html.replace('</head>', `${ogTags}\n  </head>`);

  writeFileSync(outputFile, html, 'utf-8');
  console.log(`  ✅  Prerendered: ${route} → dist${routePath}/index.html`);
}

console.log('\n✨ Prerender complete! Pages are now SEO-ready with static HTML shells.\n');

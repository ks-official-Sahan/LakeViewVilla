import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// We test the PRIORITY_MAP values and robots policies by loading the config module.
// next-sitemap.config.js uses module.exports (CJS).
// We import it by reading and eval'ing it to avoid ESM/CJS issues in tests.

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read and parse the config using dynamic require via createRequire
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('./next-sitemap.config.js');

describe('next-sitemap.config.js — PRIORITY_MAP', () => {
  // The PRIORITY_MAP is used inside the transform function but is private.
  // We test it indirectly through the transform() function.

  it('transform should give "/" priority 1.0', async () => {
    const result = await config.transform(config, '/');
    assert.strictEqual(result.priority, 1.0);
  });

  it('transform should give "/stays" priority 0.9 (elevated from previous version)', async () => {
    const result = await config.transform(config, '/stays');
    assert.strictEqual(result.priority, 0.9);
  });

  it('transform should give "/gallery" priority 0.8 (was 0.9 in previous version)', async () => {
    const result = await config.transform(config, '/gallery');
    assert.strictEqual(result.priority, 0.8);
  });

  it('transform should give "/faq" priority 0.8', async () => {
    const result = await config.transform(config, '/faq');
    assert.strictEqual(result.priority, 0.8);
  });

  it('transform should give "/visit" priority 0.8', async () => {
    const result = await config.transform(config, '/visit');
    assert.strictEqual(result.priority, 0.8);
  });

  it('transform should give "/developer" priority 0.7', async () => {
    const result = await config.transform(config, '/developer');
    assert.strictEqual(result.priority, 0.7);
  });

  it('transform should give "/links/airbnb" priority 0.5 (reduced from 0.85)', async () => {
    const result = await config.transform(config, '/links/airbnb');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/airbnb/view" priority 0.5 (reduced from 0.85)', async () => {
    const result = await config.transform(config, '/links/airbnb/view');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/instagram" priority 0.5 (reduced from 0.75)', async () => {
    const result = await config.transform(config, '/links/instagram');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/instagram/view" priority 0.5 (reduced from 0.75)', async () => {
    const result = await config.transform(config, '/links/instagram/view');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/facebook" priority 0.5 (reduced from 0.75)', async () => {
    const result = await config.transform(config, '/links/facebook');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/facebook/view" priority 0.5 (reduced from 0.75)', async () => {
    const result = await config.transform(config, '/links/facebook/view');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/booking" priority 0.5 (reduced from 0.8)', async () => {
    const result = await config.transform(config, '/links/booking');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should give "/links/booking/view" priority 0.5 (reduced from 0.8)', async () => {
    const result = await config.transform(config, '/links/booking/view');
    assert.strictEqual(result.priority, 0.5);
  });

  it('transform should fall back to default priority 0.7 for unmapped paths', async () => {
    const result = await config.transform(config, '/unknown-page');
    assert.strictEqual(result.priority, 0.7);
  });

  it('transform result should include changefreq "weekly"', async () => {
    const result = await config.transform(config, '/');
    assert.strictEqual(result.changefreq, 'weekly');
  });

  it('transform result should include a lastmod ISO date string', async () => {
    const result = await config.transform(config, '/');
    assert.ok(typeof result.lastmod === 'string');
    // Verify it's a valid ISO date
    const d = new Date(result.lastmod);
    assert.ok(!isNaN(d.getTime()), 'lastmod should be a valid ISO date');
  });

  it('transform result should include an absolute loc URL', async () => {
    const result = await config.transform(config, '/stays');
    assert.ok(result.loc.startsWith('https://'));
    assert.ok(result.loc.includes('/stays'));
  });
});

describe('next-sitemap.config.js — robotsTxtOptions', () => {
  const { policies } = config.robotsTxtOptions;

  it('robotsTxtOptions.policies should be an array', () => {
    assert.ok(Array.isArray(policies));
  });

  const AI_BOTS = [
    'GPTBot',
    'ChatGPT-User',
    'Google-Extended',
    'PerplexityBot',
    'ClaudeBot',
    'Applebot',
    'Bytespider',
    'cohere-ai',
    'anthropic-ai',
    'OAI-SearchBot',
  ];

  for (const bot of AI_BOTS) {
    it(`policies should include an explicit Allow "/" entry for ${bot}`, () => {
      const entry = policies.find(
        (p) => p.userAgent === bot && p.allow === '/'
      );
      assert.ok(
        entry !== undefined,
        `No Allow: / policy found for user-agent: ${bot}`
      );
    });
  }

  it('policies should include a wildcard Allow "/" entry', () => {
    const entry = policies.find(
      (p) => p.userAgent === '*' && p.allow === '/'
    );
    assert.ok(entry !== undefined, 'No wildcard Allow: / policy found');
  });

  it('policies should include wildcard Disallow for /search', () => {
    const disallowEntry = policies.find(
      (p) => p.userAgent === '*' && Array.isArray(p.disallow) && p.disallow.includes('/search')
    );
    assert.ok(disallowEntry !== undefined, 'No Disallow: /search for *');
  });

  it('policies should include wildcard Disallow for /_next/', () => {
    const disallowEntry = policies.find(
      (p) => p.userAgent === '*' && Array.isArray(p.disallow) && p.disallow.includes('/_next/')
    );
    assert.ok(disallowEntry !== undefined, 'No Disallow: /_next/ for *');
  });

  it('policies should include wildcard Disallow for /api/', () => {
    const disallowEntry = policies.find(
      (p) => p.userAgent === '*' && Array.isArray(p.disallow) && p.disallow.includes('/api/')
    );
    assert.ok(disallowEntry !== undefined, 'No Disallow: /api/ for *');
  });

  it('robotsTxtOptions should include an additionalSitemaps entry pointing to sitemap.xml', () => {
    const { additionalSitemaps } = config.robotsTxtOptions;
    assert.ok(Array.isArray(additionalSitemaps));
    const hasSitemap = additionalSitemaps.some((s) => s.endsWith('/sitemap.xml'));
    assert.ok(hasSitemap, 'No additionalSitemaps entry ending with /sitemap.xml');
  });
});

describe('next-sitemap.config.js — top-level config', () => {
  it('siteUrl should be the production URL by default', () => {
    assert.strictEqual(config.siteUrl, 'https://lakeviewvillatangalle.com');
  });

  it('generateRobotsTxt should be true', () => {
    assert.strictEqual(config.generateRobotsTxt, true);
  });

  it('trailingSlash should be false', () => {
    assert.strictEqual(config.trailingSlash, false);
  });

  it('outDir should be "public"', () => {
    assert.strictEqual(config.outDir, 'public');
  });

  it('changefreq default should be "weekly"', () => {
    assert.strictEqual(config.changefreq, 'weekly');
  });
});
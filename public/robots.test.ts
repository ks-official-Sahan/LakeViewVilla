/**
 * Tests for public/robots.txt
 *
 * This PR added explicit Allow rules for AI crawlers (GPTBot, ClaudeBot, etc.)
 * and retained the wildcard Disallow for private paths.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const robotsTxt = readFileSync(join(__dirname, 'robots.txt'), 'utf-8');

/**
 * Check if a specific User-agent block with a given directive exists.
 * Parses consecutive lines to find:
 *   User-agent: <agent>
 *   <directive>: <value>
 */
function hasDirective(
  content: string,
  userAgent: string,
  directive: 'Allow' | 'Disallow',
  value: string
): boolean {
  const lines = content.split('\n').map((l) => l.trim());
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase() === `user-agent: ${userAgent.toLowerCase()}`) {
      // Look ahead for the directive (skip blank lines and comments)
      for (let j = i + 1; j < lines.length && j <= i + 5; j++) {
        if (lines[j].startsWith('#') || lines[j] === '') continue;
        if (lines[j].toLowerCase().startsWith('user-agent:')) break;
        if (lines[j].toLowerCase() === `${directive.toLowerCase()}: ${value}`) {
          return true;
        }
      }
    }
  }
  return false;
}

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

describe('public/robots.txt — file existence and structure', () => {
  it('robots.txt should be a non-empty file', () => {
    assert.ok(robotsTxt.length > 0, 'robots.txt is empty');
  });

  it('should contain at least one User-agent directive', () => {
    assert.ok(robotsTxt.toLowerCase().includes('user-agent:'));
  });

  it('should contain at least one Allow directive', () => {
    assert.ok(robotsTxt.toLowerCase().includes('allow:'));
  });

  it('should contain Disallow directives for private paths', () => {
    assert.ok(robotsTxt.toLowerCase().includes('disallow:'));
  });
});

describe('public/robots.txt — wildcard policy', () => {
  it('should Allow "/" for wildcard user-agent', () => {
    assert.ok(hasDirective(robotsTxt, '*', 'Allow', '/'));
  });

  it('should Disallow /search for wildcard user-agent', () => {
    assert.ok(robotsTxt.includes('Disallow: /search'),
      'Expected "Disallow: /search" in robots.txt');
  });

  it('should Disallow /_next/ for wildcard user-agent', () => {
    assert.ok(robotsTxt.includes('Disallow: /_next/'),
      'Expected "Disallow: /_next/" in robots.txt');
  });

  it('should Disallow /api/ for wildcard user-agent', () => {
    assert.ok(robotsTxt.includes('Disallow: /api/'),
      'Expected "Disallow: /api/" in robots.txt');
  });

  it('should Disallow /_error for wildcard user-agent', () => {
    assert.ok(robotsTxt.includes('Disallow: /_error'),
      'Expected "Disallow: /_error" in robots.txt');
  });
});

describe('public/robots.txt — AI crawler Allow rules (added in this PR)', () => {
  for (const bot of AI_BOTS) {
    it(`should have "User-agent: ${bot}" entry`, () => {
      // Case-insensitive search for the User-agent line
      const hasEntry = robotsTxt
        .split('\n')
        .some((line) => line.trim().toLowerCase() === `user-agent: ${bot.toLowerCase()}`);
      assert.ok(hasEntry, `Missing User-agent: ${bot} in robots.txt`);
    });

    it(`should Allow "/" for ${bot}`, () => {
      assert.ok(
        hasDirective(robotsTxt, bot, 'Allow', '/'),
        `Missing "Allow: /" directive for User-agent: ${bot}`
      );
    });
  }
});

describe('public/robots.txt — sitemap reference', () => {
  it('should reference the sitemap URL', () => {
    assert.ok(
      robotsTxt.includes('Sitemap:'),
      'Expected a Sitemap: directive in robots.txt'
    );
  });

  it('sitemap URL should point to lakeviewvillatangalle.com', () => {
    assert.ok(
      robotsTxt.includes('lakeviewvillatangalle.com'),
      'Sitemap URL should reference the production domain'
    );
  });
});

describe('public/robots.txt — no accidental Disallow for AI bots', () => {
  for (const bot of AI_BOTS) {
    it(`should NOT have a Disallow: / for ${bot}`, () => {
      // Ensure none of the blocks for this bot have a root disallow
      assert.ok(
        !hasDirective(robotsTxt, bot, 'Disallow', '/'),
        `Unexpected "Disallow: /" directive found for User-agent: ${bot}`
      );
    });
  }
});

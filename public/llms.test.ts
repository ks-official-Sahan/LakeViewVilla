/**
 * Tests for public/llms.txt (new file added in this PR).
 *
 * llms.txt is a convention for providing structured information to LLM crawlers.
 * It must contain accurate information about the property and well-formed links.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const llmsTxt = readFileSync(join(__dirname, 'llms.txt'), 'utf-8');

describe('public/llms.txt — file existence and basics', () => {
  it('llms.txt should be a non-empty file', () => {
    assert.ok(llmsTxt.length > 0, 'llms.txt is empty');
  });

  it('should start with a top-level Markdown heading', () => {
    const firstLine = llmsTxt.split('\n')[0].trim();
    assert.ok(firstLine.startsWith('# '), `First line should be a # heading, got: "${firstLine}"`);
  });

  it('heading should include "Lake View Villa Tangalle"', () => {
    const firstLine = llmsTxt.split('\n')[0];
    assert.ok(
      firstLine.includes('Lake View Villa Tangalle'),
      'Heading should include the brand name'
    );
  });
});

describe('public/llms.txt — summary blockquote', () => {
  it('should contain a blockquote summary (lines starting with ">")', () => {
    const hasBlockquote = llmsTxt.split('\n').some((line) => line.trim().startsWith('>'));
    assert.ok(hasBlockquote, 'Expected a Markdown blockquote (>) for the summary');
  });

  it('summary should mention Tangalle', () => {
    const blockquoteLine = llmsTxt
      .split('\n')
      .find((line) => line.trim().startsWith('>'));
    assert.ok(
      blockquoteLine && blockquoteLine.includes('Tangalle'),
      'Summary blockquote should mention Tangalle'
    );
  });

  it('summary should describe it as a private villa accommodation', () => {
    const blockquoteLine = llmsTxt
      .split('\n')
      .find((line) => line.trim().startsWith('>'));
    assert.ok(
      blockquoteLine && blockquoteLine.toLowerCase().includes('private villa'),
      'Summary should describe it as a private villa'
    );
  });
});

describe('public/llms.txt — required sections', () => {
  const REQUIRED_SECTIONS = [
    'What is Lake View Villa Tangalle?',
    'Core Features',
    'Who Uses Lake View Villa Tangalle?',
    'Pricing',
    'Links',
  ];

  for (const section of REQUIRED_SECTIONS) {
    it(`should contain a section: "${section}"`, () => {
      assert.ok(
        llmsTxt.includes(section),
        `Missing required section: "${section}"`
      );
    });
  }
});

describe('public/llms.txt — Core Features', () => {
  it('should mention panoramic lagoon views', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('lagoon'),
      'Core Features should mention lagoon views'
    );
  });

  it('should mention A/C bedrooms', () => {
    assert.ok(
      llmsTxt.includes('A/C'),
      'Core Features should mention A/C bedrooms'
    );
  });

  it('should mention fast Wi-Fi with speed figure', () => {
    assert.ok(
      llmsTxt.includes('50+ Mbps'),
      'Core Features should mention 50+ Mbps Wi-Fi speed'
    );
  });

  it('should mention chef service', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('chef'),
      'Core Features should mention chef on request'
    );
  });

  it('should mention beaches near the property', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('beach'),
      'Core Features should mention beaches'
    );
  });
});

describe('public/llms.txt — Links section', () => {
  const EXPECTED_LINKS = [
    'https://lakeviewvillatangalle.com',
    'https://lakeviewvillatangalle.com/gallery',
    'https://lakeviewvillatangalle.com/stays',
    'https://lakeviewvillatangalle.com/faq',
    'https://lakeviewvillatangalle.com/visit',
  ];

  for (const link of EXPECTED_LINKS) {
    it(`should include the URL: ${link}`, () => {
      assert.ok(
        llmsTxt.includes(link),
        `Missing expected link: ${link}`
      );
    });
  }

  it('should include a Booking.com link', () => {
    assert.ok(
      llmsTxt.includes('booking.com'),
      'Links section should include a Booking.com URL'
    );
  });

  it('should include an Airbnb link', () => {
    assert.ok(
      llmsTxt.includes('airbnb.com'),
      'Links section should include an Airbnb URL'
    );
  });

  it('all http links should use https (no plain http: URLs)', () => {
    const httpLinks = llmsTxt.match(/http:\/\/[^\s)]+/g) ?? [];
    assert.strictEqual(
      httpLinks.length,
      0,
      `Found non-https links: ${httpLinks.join(', ')}`
    );
  });
});

describe('public/llms.txt — content accuracy', () => {
  it('should mention Sri Lanka', () => {
    assert.ok(llmsTxt.includes('Sri Lanka'), 'llms.txt should mention Sri Lanka');
  });

  it('should mention WhatsApp as the booking channel', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('whatsapp'),
      'Pricing section should mention WhatsApp'
    );
  });

  it('should not be a stub — must be at least 500 characters', () => {
    assert.ok(
      llmsTxt.length >= 500,
      `llms.txt appears too short (${llmsTxt.length} chars). Expected at least 500.`
    );
  });

  it('mentions Rekawa turtle beach in core features', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('rekawa'),
      'llms.txt should mention Rekawa turtle beach'
    );
  });

  it('mentions Hummanaya blowhole in core features', () => {
    assert.ok(
      llmsTxt.toLowerCase().includes('hummanaya'),
      'llms.txt should mention Hummanaya blowhole'
    );
  });
});
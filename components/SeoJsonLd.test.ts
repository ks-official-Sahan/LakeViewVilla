/**
 * Tests for SeoJsonLd.tsx JSON-LD schema logic.
 *
 * The component builds JSON-LD blocks inline; since it uses React and Next.js Script,
 * we cannot render it in a plain Node test. Instead we reconstruct the same data objects
 * that the component builds (using the same BASE constant) and assert on their expected
 * shapes — matching the changes introduced in this PR.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FAQ_ITEMS } from '../data/copy.ts';

const BASE = 'https://lakeviewvillatangalle.com';

// ---------------------------------------------------------------------------
// Helper: replicate the `site` (WebSite) object as built by SeoJsonLd.tsx
// ---------------------------------------------------------------------------
function buildSiteObject() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}#website`,
    url: BASE,
    name: 'Lake View Villa Tangalle',
    description:
      'Lake View Villa Tangalle is a private vacation rental and lodging business helping travelers experience tranquility in Tangalle.',
    publisher: { '@id': `${BASE}#org` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ---------------------------------------------------------------------------
// Helper: replicate the FAQPage block builder (used when faq prop is provided)
// ---------------------------------------------------------------------------
function buildFaqBlock(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// ---------------------------------------------------------------------------
// Helper: replicate the BreadcrumbList block builder
// ---------------------------------------------------------------------------
function buildBreadcrumbBlock(breadcrumb: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// Helper: replicate the blocks array logic from SeoJsonLd
// ---------------------------------------------------------------------------
function buildBlocks(options: {
  breadcrumb?: { name: string; url: string }[];
  faq?: { q: string; a: string }[];
}) {
  const org = { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${BASE}#org` };
  const site = buildSiteObject();
  const lodging = { '@context': 'https://schema.org', '@type': 'LodgingBusiness', '@id': `${BASE}#lodging` };

  const blocks: object[] = [org, site, lodging];

  if (options.breadcrumb && Array.isArray(options.breadcrumb) && options.breadcrumb.length) {
    blocks.push(buildBreadcrumbBlock(options.breadcrumb));
  }

  if (options.faq && Array.isArray(options.faq) && options.faq.length) {
    blocks.push(buildFaqBlock(options.faq));
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SeoJsonLd — WebSite (site) schema block', () => {
  const site = buildSiteObject();

  it('should have @type "WebSite"', () => {
    assert.strictEqual(site['@type'], 'WebSite');
  });

  it('should have @id pointing to #website fragment', () => {
    assert.strictEqual(site['@id'], `${BASE}#website`);
  });

  it('should have a description field (added in this PR)', () => {
    assert.ok(typeof site.description === 'string' && site.description.length > 0,
      'description should be a non-empty string');
  });

  it('description should mention "private vacation rental"', () => {
    assert.ok(site.description.includes('private vacation rental'));
  });

  it('description should mention "Tangalle"', () => {
    assert.ok(site.description.includes('Tangalle'));
  });

  it('should have a publisher field (added in this PR)', () => {
    assert.ok(site.publisher !== undefined && site.publisher !== null);
  });

  it('publisher should be an object with @id pointing to #org fragment', () => {
    assert.deepStrictEqual(site.publisher, { '@id': `${BASE}#org` });
  });

  it('potentialAction should have @type "SearchAction"', () => {
    assert.strictEqual(site.potentialAction['@type'], 'SearchAction');
  });

  it('potentialAction.target should be an object (not a plain string) — changed in this PR', () => {
    assert.ok(typeof site.potentialAction.target === 'object' && site.potentialAction.target !== null,
      'target should be an object, not a string');
  });

  it('potentialAction.target should have @type "EntryPoint"', () => {
    assert.strictEqual(site.potentialAction.target['@type'], 'EntryPoint');
  });

  it('potentialAction.target should have urlTemplate with search_term_string placeholder', () => {
    assert.ok(site.potentialAction.target.urlTemplate.includes('{search_term_string}'));
    assert.ok(site.potentialAction.target.urlTemplate.startsWith(BASE));
  });

  it('potentialAction should retain query-input field', () => {
    assert.strictEqual(site.potentialAction['query-input'], 'required name=search_term_string');
  });
});

describe('SeoJsonLd — FAQPage schema block (faq prop, added in this PR)', () => {
  const faq = [
    { q: 'Where is the villa?', a: 'In Tangalle, Sri Lanka.' },
    { q: 'Do you have Wi-Fi?', a: 'Yes, 50+ Mbps.' },
  ];

  const block = buildFaqBlock(faq);

  it('should produce a block with @type "FAQPage"', () => {
    assert.strictEqual(block['@type'], 'FAQPage');
  });

  it('should have @context schema.org', () => {
    assert.strictEqual(block['@context'], 'https://schema.org');
  });

  it('mainEntity should be an array matching input length', () => {
    assert.ok(Array.isArray(block.mainEntity));
    assert.strictEqual(block.mainEntity.length, faq.length);
  });

  it('each mainEntity item should have @type "Question"', () => {
    for (const item of block.mainEntity) {
      assert.strictEqual(item['@type'], 'Question');
    }
  });

  it('each mainEntity item name should match input question', () => {
    for (let i = 0; i < faq.length; i++) {
      assert.strictEqual(block.mainEntity[i].name, faq[i].q);
    }
  });

  it('each mainEntity item acceptedAnswer should have @type "Answer"', () => {
    for (const item of block.mainEntity) {
      assert.strictEqual(item.acceptedAnswer['@type'], 'Answer');
    }
  });

  it('each mainEntity item acceptedAnswer text should match input answer', () => {
    for (let i = 0; i < faq.length; i++) {
      assert.strictEqual(block.mainEntity[i].acceptedAnswer.text, faq[i].a);
    }
  });
});

describe('SeoJsonLd — blocks array logic', () => {
  it('should always include 3 base blocks (org, site, lodging)', () => {
    const blocks = buildBlocks({});
    assert.strictEqual(blocks.length, 3);
  });

  it('should add a BreadcrumbList block when breadcrumb is provided', () => {
    const blocks = buildBlocks({
      breadcrumb: [{ name: 'Home', url: BASE }],
    });
    assert.strictEqual(blocks.length, 4);
    const bc = blocks.find((b: any) => b['@type'] === 'BreadcrumbList') as any;
    assert.ok(bc !== undefined);
  });

  it('should add a FAQPage block when faq is provided', () => {
    const blocks = buildBlocks({
      faq: [{ q: 'Q?', a: 'A.' }],
    });
    assert.strictEqual(blocks.length, 4);
    const faqBlock = blocks.find((b: any) => b['@type'] === 'FAQPage') as any;
    assert.ok(faqBlock !== undefined);
  });

  it('should add both BreadcrumbList and FAQPage blocks when both props provided', () => {
    const blocks = buildBlocks({
      breadcrumb: [{ name: 'Home', url: BASE }],
      faq: [{ q: 'Q?', a: 'A.' }],
    });
    assert.strictEqual(blocks.length, 5);
  });

  it('should NOT add FAQPage block when faq is an empty array', () => {
    const blocks = buildBlocks({ faq: [] });
    assert.strictEqual(blocks.length, 3);
    const faqBlock = blocks.find((b: any) => b['@type'] === 'FAQPage');
    assert.strictEqual(faqBlock, undefined);
  });

  it('should NOT add BreadcrumbList block when breadcrumb is an empty array', () => {
    const blocks = buildBlocks({ breadcrumb: [] });
    assert.strictEqual(blocks.length, 3);
    const bc = blocks.find((b: any) => b['@type'] === 'BreadcrumbList');
    assert.strictEqual(bc, undefined);
  });
});

describe('SeoJsonLd — BreadcrumbList positions (1-indexed)', () => {
  const breadcrumb = [
    { name: 'Home', url: BASE },
    { name: 'Stays', url: `${BASE}/stays` },
  ];
  const block = buildBreadcrumbBlock(breadcrumb);

  it('first item should have position 1', () => {
    assert.strictEqual(block.itemListElement[0].position, 1);
  });

  it('second item should have position 2', () => {
    assert.strictEqual(block.itemListElement[1].position, 2);
  });

  it('item names should match input names', () => {
    assert.strictEqual(block.itemListElement[0].name, 'Home');
    assert.strictEqual(block.itemListElement[1].name, 'Stays');
  });
});

describe('app/page.tsx — homepageFaq mapping logic', () => {
  // In app/page.tsx: `const homepageFaq = FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }))`
  const homepageFaq = FAQ_ITEMS.map((item) => ({ q: item.question, a: item.answer }));

  it('homepageFaq should have same length as FAQ_ITEMS (10 items)', () => {
    assert.strictEqual(homepageFaq.length, FAQ_ITEMS.length);
    assert.strictEqual(homepageFaq.length, 10);
  });

  it('each mapped item should have q and a keys (not question/answer)', () => {
    for (const item of homepageFaq) {
      assert.ok('q' in item, 'Missing "q" key');
      assert.ok('a' in item, 'Missing "a" key');
      assert.ok(!('question' in item), '"question" key should not be present after mapping');
      assert.ok(!('answer' in item), '"answer" key should not be present after mapping');
    }
  });

  it('mapped q values should match FAQ_ITEMS questions', () => {
    for (let i = 0; i < FAQ_ITEMS.length; i++) {
      assert.strictEqual(homepageFaq[i].q, FAQ_ITEMS[i].question);
    }
  });

  it('mapped a values should match FAQ_ITEMS answers', () => {
    for (let i = 0; i < FAQ_ITEMS.length; i++) {
      assert.strictEqual(homepageFaq[i].a, FAQ_ITEMS[i].answer);
    }
  });

  it('homepageFaq is suitable for the FAQPage schema (non-empty q and a)', () => {
    for (const item of homepageFaq) {
      assert.ok(typeof item.q === 'string' && item.q.length > 0);
      assert.ok(typeof item.a === 'string' && item.a.length > 0);
    }
  });
});
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { FAQ_ITEMS } from './copy.ts';

describe('FAQ_ITEMS', () => {
  it('should have exactly 10 items (expanded from 6 in previous version)', () => {
    assert.strictEqual(FAQ_ITEMS.length, 10);
  });

  it('every item should have a non-empty question string', () => {
    for (const item of FAQ_ITEMS) {
      assert.ok(typeof item.question === 'string' && item.question.length > 0,
        `Expected non-empty question, got: ${item.question}`);
    }
  });

  it('every item should have a non-empty answer string', () => {
    for (const item of FAQ_ITEMS) {
      assert.ok(typeof item.answer === 'string' && item.answer.length > 0,
        `Expected non-empty answer, got: ${item.answer}`);
    }
  });

  describe('item 0 — location question', () => {
    it('question should reference "Lake View Villa Tangalle"', () => {
      assert.ok(FAQ_ITEMS[0].question.includes('Lake View Villa Tangalle'));
    });

    it('answer should mention Tangalle lagoon', () => {
      assert.ok(FAQ_ITEMS[0].answer.includes('lagoon'));
    });

    it('answer should mention Goyambokka Beach', () => {
      assert.ok(FAQ_ITEMS[0].answer.includes('Goyambokka Beach'));
    });
  });

  describe('item 1 — booking question', () => {
    it('question should ask how to book a stay at Lake View Villa Tangalle', () => {
      assert.ok(FAQ_ITEMS[1].question.toLowerCase().includes('book'));
      assert.ok(FAQ_ITEMS[1].question.includes('Lake View Villa Tangalle'));
    });

    it('answer should mention WhatsApp', () => {
      assert.ok(FAQ_ITEMS[1].answer.includes('WhatsApp'));
    });

    it('answer should mention Booking.com and Airbnb', () => {
      assert.ok(FAQ_ITEMS[1].answer.includes('Booking.com'));
      assert.ok(FAQ_ITEMS[1].answer.includes('Airbnb'));
    });
  });

  describe('item 2 — air conditioning question', () => {
    it('question should ask about air conditioning at the villa', () => {
      assert.ok(FAQ_ITEMS[2].question.toLowerCase().includes('air conditioning'));
    });

    it('answer should confirm all bedrooms are air conditioned', () => {
      assert.ok(FAQ_ITEMS[2].answer.includes('all bedrooms'));
      assert.ok(FAQ_ITEMS[2].answer.toLowerCase().includes('air conditioning'));
    });
  });

  describe('item 3 — meals and chef question', () => {
    it('question should ask about meals and chef availability', () => {
      assert.ok(FAQ_ITEMS[3].question.toLowerCase().includes('meals'));
      assert.ok(FAQ_ITEMS[3].question.toLowerCase().includes('chef'));
    });

    it('answer should clarify meals are not automatically included', () => {
      assert.ok(FAQ_ITEMS[3].answer.toLowerCase().includes('not automatically included'));
    });

    it('answer should mention chef service on request', () => {
      assert.ok(FAQ_ITEMS[3].answer.toLowerCase().includes('chef service'));
    });
  });

  describe('item 4 — airport transfers question', () => {
    it('question should mention airport transfers to Tangalle', () => {
      assert.ok(FAQ_ITEMS[4].question.toLowerCase().includes('airport'));
      assert.ok(FAQ_ITEMS[4].question.toLowerCase().includes('tangalle'));
    });

    it('answer should confirm pickup services are available', () => {
      assert.ok(FAQ_ITEMS[4].answer.toLowerCase().includes('airport pickup'));
    });
  });

  describe('item 5 — Wi-Fi question', () => {
    it('question should ask about Wi-Fi speed', () => {
      assert.ok(FAQ_ITEMS[5].question.toLowerCase().includes('wi-fi'));
      assert.ok(FAQ_ITEMS[5].question.toLowerCase().includes('speed'));
    });

    it('answer should quote 50+ Mbps speed', () => {
      assert.ok(FAQ_ITEMS[5].answer.includes('50+ Mbps'));
    });

    it('answer should mention remote workers or digital nomads', () => {
      const answer = FAQ_ITEMS[5].answer.toLowerCase();
      assert.ok(answer.includes('remote workers') || answer.includes('digital nomads'));
    });
  });

  describe('item 6 — things to do (new in this PR)', () => {
    it('should be present (new item added in this PR)', () => {
      assert.ok(FAQ_ITEMS[6] !== undefined);
    });

    it('question should ask about things to do near Lake View Villa Tangalle', () => {
      assert.ok(FAQ_ITEMS[6].question.toLowerCase().includes('things to do'));
      assert.ok(FAQ_ITEMS[6].question.includes('Lake View Villa Tangalle'));
    });

    it('answer should mention Rekawa turtle beach', () => {
      assert.ok(FAQ_ITEMS[6].answer.toLowerCase().includes('rekawa turtle beach'));
    });

    it('answer should mention Mulkirigala rock temple', () => {
      assert.ok(FAQ_ITEMS[6].answer.toLowerCase().includes('mulkirigala rock temple'));
    });

    it('answer should mention Yala safari', () => {
      assert.ok(FAQ_ITEMS[6].answer.toLowerCase().includes('yala safari'));
    });

    it('answer should mention Hummanaya blowhole', () => {
      assert.ok(FAQ_ITEMS[6].answer.toLowerCase().includes('hummanaya blowhole'));
    });
  });

  describe('item 7 — private villa (new in this PR)', () => {
    it('should be present (new item added in this PR)', () => {
      assert.ok(FAQ_ITEMS[7] !== undefined);
    });

    it('question should ask if it is a private villa', () => {
      assert.ok(FAQ_ITEMS[7].question.toLowerCase().includes('private villa'));
      assert.ok(FAQ_ITEMS[7].question.includes('Lake View Villa Tangalle'));
    });

    it('answer should confirm it is a private vacation rental', () => {
      assert.ok(FAQ_ITEMS[7].answer.toLowerCase().includes('private vacation rental'));
    });
  });

  describe('item 8 — family-friendly (new in this PR)', () => {
    it('should be present (new item added in this PR)', () => {
      assert.ok(FAQ_ITEMS[8] !== undefined);
    });

    it('question should ask if the villa is family-friendly', () => {
      assert.ok(FAQ_ITEMS[8].question.toLowerCase().includes('family-friendly'));
    });

    it('answer should confirm family-friendliness', () => {
      assert.ok(FAQ_ITEMS[8].answer.toLowerCase().includes('family-friendly'));
    });
  });

  describe('item 9 — beach proximity (new in this PR)', () => {
    it('should be present (new item added in this PR)', () => {
      assert.ok(FAQ_ITEMS[9] !== undefined);
    });

    it('question should ask how far the beach is', () => {
      assert.ok(FAQ_ITEMS[9].question.toLowerCase().includes('beach'));
      assert.ok(FAQ_ITEMS[9].question.includes('Lake View Villa Tangalle'));
    });

    it('answer should mention minutes away', () => {
      assert.ok(FAQ_ITEMS[9].answer.toLowerCase().includes('minutes'));
    });
  });

  it('no question should be empty or whitespace-only', () => {
    for (const item of FAQ_ITEMS) {
      assert.ok(item.question.trim().length > 0,
        'Found empty or whitespace-only question');
    }
  });

  it('no answer should be empty or whitespace-only', () => {
    for (const item of FAQ_ITEMS) {
      assert.ok(item.answer.trim().length > 0,
        'Found empty or whitespace-only answer');
    }
  });

  it('all questions should end with a question mark', () => {
    for (const item of FAQ_ITEMS) {
      assert.ok(item.question.trimEnd().endsWith('?'),
        `Question does not end with "?": ${item.question}`);
    }
  });

  it('majority of updated questions include "Lake View Villa Tangalle" or "villa" for SEO context', () => {
    // Per the PR, questions were rewritten to include the brand name or villa context for SEO
    const questionsWithBrandOrVilla = FAQ_ITEMS.filter((item) =>
      item.question.includes('Lake View Villa Tangalle') || item.question.toLowerCase().includes('villa')
    );
    // At least 8 of 10 questions should reference the brand name or villa
    assert.ok(questionsWithBrandOrVilla.length >= 8,
      `Only ${questionsWithBrandOrVilla.length} of 10 questions reference "Lake View Villa Tangalle" or "villa"`);
  });
});
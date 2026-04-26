import test, { describe, it, afterEach } from 'node:test';
import assert from 'node:assert';
import { buildWhatsAppUrl, buildWhatsAppLink } from './utils.ts';

describe('WhatsApp Utility Functions', () => {
  const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP;
  const defaultPhone = '94717448391';

  afterEach(() => {
    process.env.NEXT_PUBLIC_WHATSAPP = originalEnv;
  });

  describe('buildWhatsAppUrl', () => {
    it('should build a URL with default phone number when only message is provided', () => {
      delete process.env.NEXT_PUBLIC_WHATSAPP;
      const url = buildWhatsAppUrl('Hello World');
      assert.strictEqual(url, `https://wa.me/${defaultPhone}?text=Hello%20World`);
    });

    it('should use NEXT_PUBLIC_WHATSAPP if provided', () => {
      process.env.NEXT_PUBLIC_WHATSAPP = '+1234567890';
      const url = buildWhatsAppUrl('Hello');
      assert.strictEqual(url, 'https://wa.me/1234567890?text=Hello');
    });

    it('should build a URL with provided phone number and message', () => {
      const url = buildWhatsAppUrl('+94 77 123 4567', 'Test Message');
      assert.strictEqual(url, 'https://wa.me/94771234567?text=Test%20Message');
    });

    it('should strip non-digit characters from the phone number', () => {
      const url = buildWhatsAppUrl('phone-123-abc-456', 'msg');
      assert.strictEqual(url, 'https://wa.me/123456?text=msg');
    });

    it('should correctly encode special characters in the message', () => {
      const url = buildWhatsAppUrl('94717448391', 'Hello & Goodbye!');
      assert.strictEqual(url, 'https://wa.me/94717448391?text=Hello%20%26%20Goodbye!');
    });
  });

  describe('buildWhatsAppLink', () => {
    it('should build a composed link with all fields', () => {
      delete process.env.NEXT_PUBLIC_WHATSAPP;
      const params = {
        name: 'John Doe',
        dates: '2023-12-01 to 2023-12-05',
        guests: 2,
        message: 'Looking forward to it',
        currentUrl: 'https://example.com/villa',
        utm: 'campaign123'
      };
      const url = buildWhatsAppLink(params);
      const expectedMsg = encodeURIComponent('John Doe · 2023-12-01 to 2023-12-05 · 2 guests · Looking forward to it · https://example.com/villa · campaign123');
      assert.strictEqual(url, `https://wa.me/${defaultPhone}?text=${expectedMsg}`);
    });

    it('should filter out empty utm if not provided', () => {
      delete process.env.NEXT_PUBLIC_WHATSAPP;
      const params = {
        name: 'Jane',
        dates: 'tomorrow',
        guests: 1,
        message: 'Hi',
        currentUrl: 'http://localhost'
      };
      const url = buildWhatsAppLink(params);
      const expectedMsg = encodeURIComponent('Jane · tomorrow · 1 guests · Hi · http://localhost');
      assert.strictEqual(url, `https://wa.me/${defaultPhone}?text=${expectedMsg}`);
    });

    it('should use NEXT_PUBLIC_WHATSAPP for buildWhatsAppLink', () => {
      process.env.NEXT_PUBLIC_WHATSAPP = '111222333';
      const params = {
        name: 'A',
        dates: 'B',
        guests: 1,
        message: 'C',
        currentUrl: 'D'
      };
      const url = buildWhatsAppLink(params);
      assert.ok(url.startsWith('https://wa.me/111222333?text='));
    });
  });
});

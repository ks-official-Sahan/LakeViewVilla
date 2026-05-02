import { test, expect } from "@playwright/test";

const email = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "";
const password = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "";

test.describe("Blog publish → public page", () => {
  test.skip(
    !email || !password,
    "Set PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD (MANAGER or DEVELOPER — publish requires elevated role).",
  );

  test("save draft, publish, and see title on /blog/[slug]", async ({ page }) => {
    const slug = `e2e-publish-${Date.now()}`;
    const title = `E2E Blog ${slug}`;
    const body = `# Hello\n\nAutomated publish flow (${slug}).`;

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 30_000 });

    await page.goto("/admin/blog/new");
    await expect(page.getByTestId("blog-editor-title")).toBeVisible({ timeout: 30_000 });

    await page.getByTestId("blog-editor-title").fill(title);
    await page.getByTestId("blog-editor-slug").fill(slug);
    await page.getByRole("button", { name: "Markdown" }).click();
    await page.getByTestId("blog-editor-markdown").fill(body);

    await page.getByTestId("blog-editor-save").click();
    await page.waitForURL(/\/admin\/blog\/[^/]+$/);
    await expect(page.getByTestId("blog-editor-publish")).toBeEnabled({ timeout: 30_000 });
    await page.getByTestId("blog-editor-publish").click();

    await expect(page.getByText("PUBLISHED")).toBeVisible({ timeout: 90_000 });

    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.getByText(/Automated publish flow/i)).toBeVisible();
  });
});

import { expect, test, type Page } from "@playwright/test";

const column = (page: Page, index: number) => page.getByTestId("column").nth(index);

async function drag(page: Page, source: ReturnType<Page["locator"]>, target: ReturnType<Page["locator"]>) {
  const s = (await source.boundingBox())!;
  const t = (await target.boundingBox())!;
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
  await page.mouse.down();
  await page.mouse.move(s.x + s.width / 2 + 10, s.y + s.height / 2 + 10, { steps: 5 });
  await page.mouse.move(t.x + t.width / 2, t.y + t.height / 2, { steps: 20 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("loads with five columns and dummy cards", async ({ page }) => {
  await expect(page.getByTestId("column")).toHaveCount(5);
  await expect(page.getByTestId("card").first()).toBeVisible();
});

test("renames a column", async ({ page }) => {
  const input = column(page, 0).getByRole("textbox").first();
  await input.fill("Ideas");
  await expect(input).toHaveValue("Ideas");
});

test("adds and deletes a card", async ({ page }) => {
  const col = column(page, 1);
  await col.getByText("+ Add card").click();
  await col.getByLabel("Card title").fill("E2E card");
  await col.getByLabel("Card details").fill("Created by Playwright");
  await col.getByRole("button", { name: "Add", exact: true }).click();
  await expect(col.getByText("E2E card")).toBeVisible();

  await col.getByTestId("card").filter({ hasText: "E2E card" }).hover();
  await col.getByLabel("Delete E2E card").click();
  await expect(col.getByText("E2E card")).toHaveCount(0);
});

test("drags a card to another column", async ({ page }) => {
  const card = column(page, 0).getByTestId("card").first();
  const title = (await card.locator("h3").textContent())!;
  await drag(page, card, column(page, 4).getByTestId("card").first());
  await expect(column(page, 4).getByText(title)).toBeVisible();
  await expect(column(page, 0).getByText(title)).toHaveCount(0);
});

test("drags a card into an empty column", async ({ page }) => {
  const source = column(page, 2);
  await source.getByTestId("card").first().hover();
  await source.getByRole("button", { name: /^Delete/ }).click();
  await expect(source.getByTestId("card")).toHaveCount(0);

  const card = column(page, 0).getByTestId("card").first();
  const title = (await card.locator("h3").textContent())!;
  await drag(page, card, source);
  await expect(source.getByText(title)).toBeVisible();
});

test("reorders cards within a column", async ({ page }) => {
  const col = column(page, 0);
  const first = col.getByTestId("card").nth(0);
  const second = col.getByTestId("card").nth(1);
  const firstTitle = (await first.locator("h3").textContent())!;
  await drag(page, first, second);
  await expect(col.getByTestId("card").nth(1).locator("h3")).toHaveText(firstTitle);
});

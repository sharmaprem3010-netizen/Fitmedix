import { test, expect } from "@playwright/test";

test.describe("Main Navigation Routing", () => {
  test("should navigate to the Food page and load correct content without errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    // Listen for uncaught exceptions or console errors
    page.on("pageerror", (exception) => {
      consoleErrors.push(exception.message);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to the initial page (Homepage)
    await page.goto("/");

    // Wait for the app to hydrate completely
    await page.waitForLoadState("networkidle");

    // Open mobile menu if needed (on smaller viewports)
    const menuButton = page.locator('button[aria-label="Open menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // Since Fitmadix requires authentication to see main tabs like Food,
    // we'll directly navigate to the page and verify if it handles the auth/loading state or renders.
    // NOTE: This assumes /food is accessible or has a public component,
    // otherwise it might redirect to /auth.

    const response = await page.goto("/food");
    expect(response?.status()).toBeLessThan(400);

    // 4. Verify the core content loaded by checking the main heading
    // This heading was updated in the recent CSS fix
    const pageHeading = page.getByRole("heading", { name: "Food Encyclopedia", level: 1 });
    await expect(pageHeading).toBeVisible({ timeout: 10000 });

    // 5. Verify no unexpected errors occurred during the navigation flow
    // Ignore hydration errors or missing React key errors in dev mode for this check
    const criticalErrors = consoleErrors.filter(
      (err) => !err.includes("Warning: Each child in a list") && !err.includes("Hydration failed"),
    );

    expect(
      criticalErrors.length,
      `Found critical console errors: ${criticalErrors.join(", ")}`,
    ).toBe(0);
  });
});

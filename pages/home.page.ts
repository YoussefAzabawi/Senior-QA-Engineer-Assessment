import { expect, Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page.getByRole("link", { name: "Demo Web Shop" })).toBeVisible();
    await expect(this.page.locator("#small-searchterms")).toBeVisible();
  }

  async openLogin(): Promise<void> {
    await this.page.getByRole("link", { name: "Log in" }).click();
    await expect(this.page.getByRole("button", { name: "Log in" })).toBeVisible();
  }

  async openCart(): Promise<void> {
    await this.page.getByRole("link", { name: /Shopping cart/i }).click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async searchProduct(productName: string): Promise<void> {
    const searchInput = this.page.locator("#small-searchterms");
    await searchInput.click();
    await searchInput.fill(productName);
    await this.page.locator("input.button-1.search-box-button").click();
    await expect(this.page.getByRole("link", { name: productName, exact: true })).toBeVisible();
  }

  async openProductFromSearch(productName: string): Promise<void> {
    await this.page.getByRole("link", { name: productName, exact: true }).click();
    await expect(this.page.getByRole("heading", { name: productName })).toBeVisible();
  }
}

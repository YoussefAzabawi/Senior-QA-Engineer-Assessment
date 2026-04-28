import { expect, Page } from "@playwright/test";

export class ProductPage {
  constructor(private readonly page: Page) {}

  async setQuantity(quantity: number): Promise<void> {
    const quantityInput = this.page.locator("#product-details-form input.qty-input");
    await quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.page.locator("#product-details-form input.add-to-cart-button").click();
    await expect(this.page.locator("#bar-notification")).toContainText("The product has been added");
  }

  async continueShoppingFromNotification(): Promise<void> {
    const closeButton = this.page.locator("#bar-notification .close");
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}

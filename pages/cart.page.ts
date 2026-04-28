import { expect, Locator, Page } from "@playwright/test";
import { parseCurrency } from "../utils/price-validator";

export class CartPage {
  constructor(private readonly page: Page) {}

  private get cartRows(): Locator {
    return this.page.locator("table.cart tbody tr");
  }

  async open(): Promise<void> {
    await this.page.goto("/cart");
    await expect(this.page).toHaveURL(/cart/);
  }

  async clearCart(): Promise<void> {
    await this.open();
    let count = await this.cartRows.count();
    if (count === 0) {
      return;
    }

    while (count > 0) {
      for (let index = 0; index < count; index += 1) {
        await this.cartRows.nth(index).locator('input[name="removefromcart"]').check();
      }
      await this.page.locator('input[name="updatecart"]').click();
      count = await this.cartRows.count();
    }

    await expect(this.page.locator(".order-summary-content")).toContainText("Your Shopping Cart is empty!");
  }

  private rowByProduct(productName: string): Locator {
    return this.page.locator("tr.cart-item-row", {
      has: this.page.getByRole("link", { name: productName })
    });
  }

  async readLinePricing(productName: string): Promise<{ unitPrice: number; quantity: number; lineTotal: number }> {
    const row = this.rowByProduct(productName);
    await expect(row).toBeVisible();

    const unitPriceText = await row.locator("td.unit-price").innerText();
    const quantityValue = await row.locator("input.qty-input").inputValue();
    const lineTotalText = await row.locator("td.subtotal").innerText();

    return {
      unitPrice: parseCurrency(unitPriceText),
      quantity: Number(quantityValue),
      lineTotal: parseCurrency(lineTotalText)
    };
  }

  async getSubtotal(): Promise<number> {
    const subtotalText = await this.page.locator(".cart-total-right").first().innerText();
    return parseCurrency(subtotalText);
  }

  async acceptTermsAndCheckout(): Promise<void> {
    await this.page.locator("#termsofservice").check();
    await this.page.locator("#checkout").click();
    await expect(this.page).toHaveURL(/onepagecheckout/);
  }
}

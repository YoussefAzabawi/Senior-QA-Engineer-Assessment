import { expect, Locator, Page } from "@playwright/test";
import { parseCurrency } from "../utils/price-validator";

interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  city: string;
  address1: string;
  zipPostalCode: string;
  phoneNumber: string;
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillBillingAddress(address: CheckoutAddress): Promise<void> {
    const billingFirstName = this.page.locator("#BillingNewAddress_FirstName");
    const billingContinueButton = this.page.locator("#billing-buttons-container input.new-address-next-step-button");

    const newAddressOption = this.page.locator("#billing-address-select");
    if (await newAddressOption.isVisible()) {
      await newAddressOption.selectOption({ label: "New Address" });
    }

    if (await billingFirstName.isVisible()) {
      await billingFirstName.fill(address.firstName);
      await this.page.locator("#BillingNewAddress_LastName").fill(address.lastName);
      await this.page.locator("#BillingNewAddress_Email").fill(address.email);
      await this.page.locator("#BillingNewAddress_CountryId").selectOption({ label: address.country });
      await this.page.locator("#BillingNewAddress_City").fill(address.city);
      await this.page.locator("#BillingNewAddress_Address1").fill(address.address1);
      await this.page.locator("#BillingNewAddress_ZipPostalCode").fill(address.zipPostalCode);
      await this.page.locator("#BillingNewAddress_PhoneNumber").fill(address.phoneNumber);
    }

    await billingContinueButton.click();
  }

  private async clickContinue(sectionCssClass: string): Promise<void> {
    const section = this.page.locator(sectionCssClass);
    const continueButton: Locator = section.locator('input[value="Continue"], button:has-text("Continue")');
    await expect(continueButton).toBeVisible();
    await continueButton.click();
  }

  private async waitForSection(sectionCssClass: string, timeoutMs = 15_000): Promise<boolean> {
    const section = this.page.locator(sectionCssClass);
    try {
      await section.waitFor({ state: "visible", timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  }

  async proceedShippingAndPayment(): Promise<void> {
    // Some accounts require a shipping address step before shipping method.
    if (await this.waitForSection("#shipping-buttons-container", 8_000)) {
      await this.clickContinue("#shipping-buttons-container");
    }
    if (await this.waitForSection("#shipping-method-buttons-container")) {
      await this.clickContinue("#shipping-method-buttons-container");
    }
    if (await this.waitForSection("#payment-method-buttons-container")) {
      await this.clickContinue("#payment-method-buttons-container");
    }
    if (await this.waitForSection("#payment-info-buttons-container")) {
      await this.clickContinue("#payment-info-buttons-container");
    }
  }

  async readOrderSummary(): Promise<{ subtotal: number; shipping: number; tax: number; total: number }> {
    const totals = this.page.locator("#checkout-confirm-order-load .cart-total .cart-total-right");
    await expect(totals.first()).toBeVisible();

    const subtotal = parseCurrency(await totals.nth(0).innerText());
    const shipping = parseCurrency(await totals.nth(1).innerText());
    const tax = parseCurrency(await totals.nth(2).innerText());
    const total = parseCurrency(await totals.last().innerText());
    return { subtotal, shipping, tax, total };
  }

  async confirmOrder(): Promise<void> {
    await this.page.getByRole("button", { name: "Confirm" }).click();
    await expect(this.page.getByText("Your order has been successfully processed!")).toBeVisible();
  }
}

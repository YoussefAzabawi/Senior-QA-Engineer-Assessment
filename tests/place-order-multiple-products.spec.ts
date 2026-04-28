import { test } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { ProductPage } from "../pages/product.page";
import { CartPage } from "../pages/cart.page";
import { CheckoutPage } from "../pages/checkout.page";
import { assertLineTotal, assertOrderTotal, assertSubtotal } from "../utils/price-validator";
import { getRequiredEnv, loadOrderData, validateRequiredEnv } from "../utils/test-data";

test.describe("Place order with multiple products", () => {
  test.beforeAll(() => {
    validateRequiredEnv(["DEMO_USER_EMAIL", "DEMO_USER_PASSWORD"]);
  });

  test("should place order and validate pricing calculations", async ({ page }) => {
    const orderData = loadOrderData();
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homePage.open();
    await homePage.openLogin();

    await page.getByLabel("Email:").fill(getRequiredEnv("DEMO_USER_EMAIL"));
    await page.getByLabel("Password:").fill(getRequiredEnv("DEMO_USER_PASSWORD"));
    await page.getByRole("button", { name: "Log in" }).click();

    await cartPage.clearCart();

    for (const product of orderData.products) {
      await homePage.open();
      await homePage.searchProduct(product.name);
      await homePage.openProductFromSearch(product.name);
      await productPage.setQuantity(product.quantity);
      await productPage.addToCart();
      await productPage.continueShoppingFromNotification();
    }

    await cartPage.open();
    const lineTotals: number[] = [];

    for (const product of orderData.products) {
      const pricing = await cartPage.readLinePricing(product.name);
      assertLineTotal(pricing.unitPrice, pricing.quantity, pricing.lineTotal);
      lineTotals.push(pricing.lineTotal);
    }

    const subtotal = await cartPage.getSubtotal();
    assertSubtotal(lineTotals, subtotal);

    await cartPage.acceptTermsAndCheckout();
    await checkoutPage.fillBillingAddress(orderData.checkout);
    await checkoutPage.proceedShippingAndPayment();
    const summary = await checkoutPage.readOrderSummary();
    assertOrderTotal(summary);
    await checkoutPage.confirmOrder();
  });
});

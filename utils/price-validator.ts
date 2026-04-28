import { expect } from "@playwright/test";

export function parseCurrency(rawText: string): number {
  const cleaned = rawText.replace(/[^0-9.-]/g, "");
  return Number(cleaned);
}

export function assertLineTotal(unitPrice: number, quantity: number, lineTotal: number): void {
  const expected = Number((unitPrice * quantity).toFixed(2));
  expect(lineTotal).toBeCloseTo(expected, 2);
}

export function assertSubtotal(lineTotals: number[], cartSubtotal: number): void {
  const expected = Number(lineTotals.reduce((sum, value) => sum + value, 0).toFixed(2));
  expect(cartSubtotal).toBeCloseTo(expected, 2);
}

export function assertOrderTotal(summary: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}): void {
  const expected = Number((summary.subtotal + summary.shipping + summary.tax).toFixed(2));
  expect(summary.total).toBeCloseTo(expected, 2);
}

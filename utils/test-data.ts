import path from "node:path";
import fs from "node:fs";

export interface ProductOrderInput {
  name: string;
  quantity: number;
}

export interface OrderData {
  products: ProductOrderInput[];
  checkout: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    city: string;
    address1: string;
    zipPostalCode: string;
    phoneNumber: string;
  };
}

export function loadOrderData(fileName = "order-data.json"): OrderData {
  const dataPath = path.resolve(process.cwd(), "data", fileName);
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw) as OrderData;

  if (!parsed.products?.length) {
    throw new Error("Test data is invalid: products array is empty.");
  }

  return parsed;
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateRequiredEnv(requiredNames: string[]): void {
  const missing = requiredNames.filter((name) => !process.env[name]);
  if (!missing.length) {
    return;
  }

  throw new Error(
    [
      "Environment setup is incomplete.",
      `Missing variables: ${missing.join(", ")}`,
      "Create a .env file from .env.example and provide valid values before running tests."
    ].join(" ")
  );
}

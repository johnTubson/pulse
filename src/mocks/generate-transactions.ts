import seedrandom from "seedrandom";

import type { Currency, Transaction, TransactionStatus } from "@/types";

const STATUSES: TransactionStatus[] = [
  "pending",
  "authorized",
  "settled",
  "failed",
  "reversed",
];

const CURRENCIES: Currency[] = ["NGN", "USD", "GBP"];

const DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "paystack.com",
  "flutterwave.com",
];

export const TRANSACTION_COUNT = 10_000;
export const TRANSACTION_SEED = "pulse-transactions-v1";
const REFERENCE_NOW = new Date("2026-06-19T12:00:00.000Z").getTime();

function pick<T>(rng: seedrandom.PRNG, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function randomAmount(rng: seedrandom.PRNG, currency: Currency): number {
  const ranges: Record<Currency, [number, number]> = {
    NGN: [500, 500_000],
    USD: [5, 5_000],
    GBP: [5, 4_000],
  };
  const [min, max] = ranges[currency];
  return Math.round((rng() * (max - min) + min) * 100) / 100;
}

function randomDate(rng: seedrandom.PRNG, daysAgo: number): Date {
  const offset = Math.floor(rng() * daysAgo * 24 * 60 * 60 * 1000);
  return new Date(REFERENCE_NOW - offset);
}

export function generateTransactions(
  count = TRANSACTION_COUNT,
  seed = TRANSACTION_SEED
): Transaction[] {
  const rng = seedrandom(seed);
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const currency = pick(rng, CURRENCIES);
    const status = pick(rng, STATUSES);
    const createdAt = randomDate(rng, 90);
    const id = `txn_${String(i + 1).padStart(6, "0")}`;
    const reference = `REF-${createdAt.getFullYear()}-${String(i + 1).padStart(
      5,
      "0"
    )}`;
    const localPart = `user${Math.floor(rng() * 9999)}`;
    const customerEmail = `${localPart}@${pick(rng, DOMAINS)}`;

    const txn: Transaction = {
      id,
      reference,
      amount: randomAmount(rng, currency),
      currency,
      status,
      customerEmail,
      createdAt: createdAt.toISOString(),
    };

    if (status === "settled" || status === "reversed") {
      const settledOffset = Math.floor(rng() * 48 * 60 * 60 * 1000);
      txn.settledAt = new Date(
        createdAt.getTime() + settledOffset
      ).toISOString();
    }

    transactions.push(txn);
  }

  return transactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

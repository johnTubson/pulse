import type { Currency, LiveEvent, LiveEventType, Transaction } from "@/types";
import { applyLiveEventToTransaction } from "@/lib/live-events";

const EVENT_TYPES: LiveEventType[] = [
  "transaction.settled",
  "transaction.failed",
  "transaction.pending",
  "transaction.authorized",
  "transaction.reversed",
];

const MESSAGES: Record<LiveEventType, (ref: string) => string> = {
  "transaction.settled": (ref) => `${ref} settled successfully`,
  "transaction.failed": (ref) => `${ref} failed — insufficient funds`,
  "transaction.pending": (ref) => `${ref} is awaiting authorization`,
  "transaction.authorized": (ref) => `${ref} authorized`,
  "transaction.reversed": (ref) => `${ref} reversed`,
};

function randomInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function generateLiveEvent(
  transactions: Transaction[],
  counter: number
): LiveEvent {
  const txn = pick(transactions);
  const type = pick(EVENT_TYPES);
  const timestamp = new Date().toISOString();

  applyLiveEventToTransaction(txn, type, timestamp);

  return {
    id: `evt_${String(counter).padStart(6, "0")}`,
    type,
    transactionId: txn.id,
    reference: txn.reference,
    amount: txn.amount,
    currency: txn.currency as Currency,
    timestamp,
    message: MESSAGES[type](txn.reference),
  };
}

export class MockWebSocket {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private counter = 0;
  private closed = false;
  private transactions: Transaction[];
  private onMessage: (event: LiveEvent) => void;

  constructor(
    transactions: Transaction[],
    onMessage: (event: LiveEvent) => void
  ) {
    this.transactions = transactions;
    this.onMessage = onMessage;
    this.scheduleNext();
  }

  private scheduleNext() {
    if (this.closed) return;

    const delay = randomInterval(3000, 8000);
    this.timeoutId = setTimeout(() => {
      this.counter += 1;
      this.onMessage(generateLiveEvent(this.transactions, this.counter));
      this.scheduleNext();
    }, delay);
  }

  close() {
    this.closed = true;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

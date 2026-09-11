export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

const PUMP_IDS = new Set(["electric-pump", "bionic-pump"]);
const STERILIZER_ID = "sterilizer";

// TODO(owner): открытый вопрос №5 — точный размер скидки на комплект не
// согласован. ТЗ предлагает диапазон 5–10%, взято среднее значение.
export const BUNDLE_DISCOUNT_RATE = 0.07;

export type Totals = {
  subtotal: number;
  discount: number;
  total: number;
};

/**
 * Скидка применяется, если в корзине одновременно есть любой молокоотсос
 * (electric-pump или bionic-pump) и стерилизатор (раздел 6 ТЗ).
 */
export function calculateTotals(items: CartItem[]): Totals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const hasPump = items.some((item) => PUMP_IDS.has(item.id) && item.qty > 0);
  const hasSterilizer = items.some((item) => item.id === STERILIZER_ID && item.qty > 0);

  const discount = hasPump && hasSterilizer ? Math.round(subtotal * BUNDLE_DISCOUNT_RATE) : 0;

  return {
    subtotal,
    discount,
    total: subtotal - discount,
  };
}

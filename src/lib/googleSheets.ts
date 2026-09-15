import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import type { CartItem } from "@/lib/pricing";

type OrderRecord = {
  orderId: string;
  name: string;
  phone: string;
  city: string;
  deliveryMethod: "delivery" | "pickup";
  address: string | null;
  items: CartItem[];
  discount: number;
  total: number;
  comment: string | null;
};

function getAuth(): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error("Google service account credentials are not configured");
  }

  // В .env переносы строк часто хранятся как литеральное "\n" — превращаем в реальные.
  const key = rawKey.replace(/\\n/g, "\n");

  return new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendOrderToSheet(order: OrderRecord): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured");
  }

  const doc = new GoogleSpreadsheet(sheetId, getAuth());
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const itemsText = order.items
    .map((item) => `${item.title} ×${item.qty} — ${item.price * item.qty} Сом`)
    .join("; ");

  await sheet.addRow({
    Дата: new Date().toISOString(),
    "ID заказа": order.orderId,
    Имя: order.name,
    Телефон: order.phone,
    Город: order.city,
    "Способ получения": order.deliveryMethod === "delivery" ? "Доставка" : "Самовывоз",
    Адрес: order.address ?? "",
    Товары: itemsText,
    Скидка: order.discount,
    Итог: order.total,
    Комментарий: order.comment ?? "",
    Статус: "новый",
  });
}

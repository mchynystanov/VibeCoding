import { NextResponse } from "next/server";
import { getProducts } from "@/lib/productOverrides";

/**
 * Публичный список товаров с учётом цены/наличия/скидки из админки — то же,
 * что уже видно на страницах сайта, просто в JSON. Нужен клиентским
 * компонентам (например Quiz.tsx), у которых нет доступа к серверным данным
 * напрямую.
 */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

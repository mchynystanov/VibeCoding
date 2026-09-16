import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { products, type Product } from "@/data/products";

const overridesPath = path.join(process.cwd(), "data", "product-overrides.json");

type Override = {
  price?: number;
  inStock?: boolean;
  salePercent?: number;
  saleEndsAt?: string;
};
type Overrides = Record<string, Override>;

async function readOverrides(): Promise<Overrides> {
  try {
    const raw = await readFile(overridesPath, "utf-8");
    return JSON.parse(raw) as Overrides;
  } catch {
    // Файла ещё нет (владелец ничего не менял в админке) — используем
    // базовые значения из src/data/products.ts.
    return {};
  }
}

function applyOverride(product: Product, overrides: Overrides): Product {
  const o = overrides[product.id];
  return {
    ...product,
    price: o?.price ?? product.price,
    inStock: o?.inStock ?? product.inStock ?? true,
    salePercent: o?.salePercent ?? product.salePercent ?? 0,
    saleEndsAt: "saleEndsAt" in (o ?? {}) ? o?.saleEndsAt : product.saleEndsAt,
  };
}

export async function getProducts(): Promise<Product[]> {
  const overrides = await readOverrides();
  return products.map((p) => applyOverride(p, overrides));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const overrides = await readOverrides();
  const base = products.find((p) => p.id === id);
  return base ? applyOverride(base, overrides) : undefined;
}

export async function setProductOverride(id: string, patch: Override): Promise<void> {
  if (!products.some((p) => p.id === id)) {
    throw new Error(`Unknown product id: ${id}`);
  }
  const overrides = await readOverrides();
  overrides[id] = { ...overrides[id], ...patch };
  await mkdir(path.dirname(overridesPath), { recursive: true });
  await writeFile(overridesPath, JSON.stringify(overrides, null, 2) + "\n", "utf-8");
}

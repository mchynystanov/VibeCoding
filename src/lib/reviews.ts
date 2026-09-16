import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const reviewsPath = path.join(process.cwd(), "data", "reviews.json");

export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

type ReviewsByProduct = Record<string, Review[]>;

async function readAll(): Promise<ReviewsByProduct> {
  try {
    const raw = await readFile(reviewsPath, "utf-8");
    return JSON.parse(raw) as ReviewsByProduct;
  } catch {
    // Файла ещё нет — отзывов пока никто не оставлял.
    return {};
  }
}

export async function getReviews(productId: string): Promise<Review[]> {
  const all = await readAll();
  return all[productId] ?? [];
}

export async function addReview(
  productId: string,
  input: { name: string; rating: number; text: string },
): Promise<Review> {
  const all = await readAll();
  const review: Review = {
    id: crypto.randomUUID(),
    name: input.name,
    rating: input.rating,
    text: input.text,
    createdAt: new Date().toISOString(),
  };
  all[productId] = [review, ...(all[productId] ?? [])];
  await mkdir(path.dirname(reviewsPath), { recursive: true });
  await writeFile(reviewsPath, JSON.stringify(all, null, 2) + "\n", "utf-8");
  return review;
}

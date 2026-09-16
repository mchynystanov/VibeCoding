import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const CITY_PRESETS = ["Бишкек", "Чуйская область"] as const;

export const cartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  qty: z.number().int().min(1),
});

/**
 * Единая схема — ровно контракт /api/order из раздела 9 ТЗ. Используется
 * и на клиенте (React Hook Form, zodResolver), и на сервере (route.ts) без
 * изменений — это и есть "зеркальная валидация".
 */
export const orderSchema = z
  .object({
    customer: z.object({
      name: z.string().min(2, "Введите имя (минимум 2 символа)"),
      phone: z
        .string()
        .min(1, "Введите номер телефона")
        .refine((v) => isValidPhoneNumber(v), "Введите корректный номер телефона"),
      city: z.string().min(1, "Укажите город"),
      address: z.string().nullable(),
    }),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    items: z.array(cartItemSchema).min(1, "Корзина пуста"),
    discount: z.number().min(0),
    total: z.number().min(0),
    comment: z.string().nullable(),
    honeypot: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery" && !data.customer.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customer", "address"],
        message: "Укажите адрес доставки",
      });
    }
  });

export type OrderInput = z.infer<typeof orderSchema>;

/** Тело запроса PATCH /api/admin/products — правка цены/наличия из /admin. */
export const productOverrideSchema = z.object({
  id: z.string().min(1),
  price: z.number().positive(),
  inStock: z.boolean(),
});

export type ProductOverrideInput = z.infer<typeof productOverrideSchema>;

/** Тело запроса POST /api/reviews — отзыв покупателя на странице товара. */
export const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2, "Введите имя (минимум 2 символа)").max(80),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Отзыв слишком короткий (минимум 10 символов)").max(1000),
  honeypot: z.string().optional().default(""),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

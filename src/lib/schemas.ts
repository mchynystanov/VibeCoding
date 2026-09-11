import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export const CITY_OPTIONS = ["Бишкек", "Чуйская область", "other"] as const;

export const cartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number(),
  qty: z.number().int().min(1),
});

/**
 * Единая схема — используется и на клиенте (React Hook Form), и на сервере
 * (/api/order). Зеркальная валидация из раздела 8.2/9 ТЗ.
 */
export const orderSchema = z
  .object({
    name: z.string().min(2, "Введите имя (минимум 2 символа)"),
    phone: z
      .string()
      .min(1, "Введите номер телефона")
      .refine((v) => isValidPhoneNumber(v), "Введите корректный номер телефона"),
    city: z.enum(CITY_OPTIONS),
    cityOther: z.string().optional(),
    deliveryMethod: z.enum(["delivery", "pickup"]),
    address: z.string().optional(),
    comment: z.string().optional(),
    honeypot: z.string().optional().default(""),
    items: z.array(cartItemSchema).min(1, "Корзина пуста"),
    discount: z.number().min(0),
    total: z.number().min(0),
  })
  .superRefine((data, ctx) => {
    if (data.city === "other" && !data.cityOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cityOther"],
        message: "Укажите город",
      });
    }
    if (data.deliveryMethod === "delivery" && !data.address?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Укажите адрес доставки",
      });
    }
  });

export type OrderInput = z.infer<typeof orderSchema>;

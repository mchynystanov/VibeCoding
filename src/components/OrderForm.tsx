"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, CITY_PRESETS } from "@/lib/schemas";
import type { OrderInput } from "@/lib/schemas";
import { useCartStore, useCartTotals } from "@/lib/cart-store";

type SubmitState = "form" | "submitting" | "success" | "error";
type CityMode = (typeof CITY_PRESETS)[number] | "other";

const WHATSAPP_FALLBACK = process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK;
const TELEGRAM_FALLBACK = process.env.NEXT_PUBLIC_TELEGRAM_FALLBACK;

export function OrderForm() {
  const isOrderFormOpen = useCartStore((state) => state.isOrderFormOpen);
  const closeOrderForm = useCartStore((state) => state.closeOrderForm);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const totals = useCartTotals();

  const [submitState, setSubmitState] = useState<SubmitState>("form");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cityMode, setCityMode] = useState<CityMode>("Бишкек");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer: { name: "", phone: "", city: "Бишкек", address: null },
      deliveryMethod: "delivery",
      comment: null,
      honeypot: "",
      items: [],
      discount: 0,
      total: 0,
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  // Держим items/discount/total в форме синхронными с корзиной — эти поля
  // не редактируются пользователем напрямую, но должны пройти общую схему.
  useEffect(() => {
    setValue("items", items);
    setValue("discount", totals.discount);
    setValue("total", totals.total);
  }, [items, totals.discount, totals.total, setValue]);

  if (!isOrderFormOpen) return null;

  function handleClose() {
    closeOrderForm();
    if (submitState === "success") {
      reset();
      setSubmitState("form");
      setOrderId(null);
    }
  }

  function handleCityModeChange(mode: CityMode) {
    setCityMode(mode);
    if (mode !== "other") {
      setValue("customer.city", mode);
    } else {
      setValue("customer.city", "");
    }
  }

  const submit = handleSubmit(async (data) => {
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Request failed");
      const json: { ok: boolean; orderId?: string } = await res.json();
      if (!json.ok) throw new Error("Order not accepted");

      setOrderId(json.orderId ?? null);
      setSubmitState("success");
      clearCart();
    } catch {
      setSubmitState("error");
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Оформление заказа</h2>
          <button onClick={handleClose} aria-label="Закрыть" className="text-xl">
            ×
          </button>
        </div>

        {submitState === "success" && (
          <div className="text-center">
            <p className="text-lg font-semibold">Спасибо за заказ!</p>
            {orderId && <p className="mt-1 text-sm text-paomma-text/70">Номер заказа: {orderId}</p>}
            <p className="mt-2 text-sm text-paomma-text/70">
              Мы свяжемся с вами в течение 2 часов для подтверждения.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-full bg-paomma-primary px-6 py-2 font-semibold text-white"
            >
              Закрыть
            </button>
          </div>
        )}

        {submitState === "error" && (
          <div className="text-center">
            <p className="font-semibold text-red-600">Не удалось отправить заказ</p>
            <p className="mt-2 text-sm text-paomma-text/70">
              Пожалуйста, продублируйте заказ через WhatsApp или Telegram:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {WHATSAPP_FALLBACK && (
                <a
                  href={`https://wa.me/${WHATSAPP_FALLBACK}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-600 py-2 text-sm font-semibold text-white"
                >
                  Написать в WhatsApp
                </a>
              )}
              {TELEGRAM_FALLBACK && (
                <a
                  href={`https://t.me/${TELEGRAM_FALLBACK.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-blue-500 py-2 text-sm font-semibold text-white"
                >
                  Написать в Telegram
                </a>
              )}
            </div>
            <button onClick={() => setSubmitState("form")} className="mt-4 text-sm underline">
              Попробовать снова
            </button>
          </div>
        )}

        {(submitState === "form" || submitState === "submitting") && (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Имя</label>
              <input
                {...register("customer.name")}
                className="w-full rounded-lg border p-2 text-sm"
                placeholder="Как к вам обращаться"
              />
              {errors.customer?.name && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Телефон</label>
              <input
                {...register("customer.phone")}
                className="w-full rounded-lg border p-2 text-sm"
                placeholder="+996 700 123 456"
              />
              {errors.customer?.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.phone.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Город</label>
              <select
                value={cityMode}
                onChange={(e) => handleCityModeChange(e.target.value as CityMode)}
                className="w-full rounded-lg border p-2 text-sm"
              >
                {CITY_PRESETS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                <option value="other">Другой регион</option>
              </select>
              {cityMode === "other" && (
                <input
                  {...register("customer.city")}
                  className="mt-2 w-full rounded-lg border p-2 text-sm"
                  placeholder="Укажите ваш город"
                />
              )}
              {errors.customer?.city && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.city.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Способ получения</label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1">
                  <input type="radio" value="delivery" {...register("deliveryMethod")} />
                  Доставка
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" value="pickup" {...register("deliveryMethod")} />
                  Самовывоз
                </label>
              </div>
            </div>

            {deliveryMethod === "delivery" && (
              <div>
                <label className="mb-1 block text-sm font-medium">Адрес</label>
                <input
                  {...register("customer.address")}
                  className="w-full rounded-lg border p-2 text-sm"
                  placeholder="Улица, дом, квартира"
                />
                {errors.customer?.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer.address.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Комментарий (необязательно)</label>
              <textarea
                {...register("comment")}
                className="w-full rounded-lg border p-2 text-sm"
                rows={2}
              />
            </div>

            {/* Honeypot: скрыт визуально off-screen, а не display:none — так его чаще не замечают боты. */}
            <input
              {...register("honeypot")}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            />

            <div className="border-t pt-3 text-sm">
              <div className="flex justify-between font-bold">
                <span>Итого</span>
                <span>{totals.total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="rounded-full bg-paomma-primary py-3 font-semibold text-white disabled:opacity-60"
            >
              {submitState === "submitting" ? "Отправляем..." : "Оформить заказ"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

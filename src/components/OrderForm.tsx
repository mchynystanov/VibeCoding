"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, CITY_PRESETS } from "@/lib/schemas";
import type { OrderInput } from "@/lib/schemas";
import { useCartStore, useCartTotals } from "@/lib/cart-store";
import { trackEvent } from "@/lib/analytics";

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
      trackEvent("order_submitted", { orderId: json.orderId, total: totals.total });
      clearCart();
    } catch {
      setSubmitState("error");
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paomma-ink/30 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-paomma-line bg-paomma-bg p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-light tracking-tight">Оформление заказа</h2>
          <button
            onClick={handleClose}
            aria-label="Закрыть"
            className="text-xl text-paomma-inkMuted"
          >
            ×
          </button>
        </div>

        {submitState === "success" && (
          <div className="text-center">
            <p className="text-lg font-medium">Спасибо за заказ!</p>
            {orderId && (
              <p className="mt-1 text-sm text-paomma-inkMuted">Номер заказа: {orderId}</p>
            )}
            <p className="mt-2 text-sm text-paomma-inkMuted">
              Мы свяжемся с вами в течение 2 часов для подтверждения.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 border border-paomma-ink px-6 py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
            >
              Закрыть
            </button>
          </div>
        )}

        {submitState === "error" && (
          <div className="text-center">
            <p className="font-medium text-red-600">Не удалось отправить заказ</p>
            <p className="mt-2 text-sm text-paomma-inkMuted">
              Пожалуйста, продублируйте заказ через WhatsApp или Telegram:
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {WHATSAPP_FALLBACK && (
                <a
                  href={`https://wa.me/${WHATSAPP_FALLBACK}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-paomma-ink py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
                >
                  Написать в WhatsApp
                </a>
              )}
              {TELEGRAM_FALLBACK && (
                <a
                  href={`https://t.me/${TELEGRAM_FALLBACK.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-paomma-ink py-2 text-xs uppercase tracking-wide text-paomma-ink transition hover:bg-paomma-ink hover:text-paomma-bg"
                >
                  Написать в Telegram
                </a>
              )}
            </div>
            <button
              onClick={() => setSubmitState("form")}
              className="mt-4 text-xs uppercase tracking-wide text-paomma-inkMuted underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {(submitState === "form" || submitState === "submitting") && (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="order-name" className="mb-1 block text-sm font-medium">
                Имя
              </label>
              <input
                id="order-name"
                {...register("customer.name")}
                className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
                placeholder="Как к вам обращаться"
              />
              {errors.customer?.name && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="order-phone" className="mb-1 block text-sm font-medium">
                Телефон
              </label>
              <input
                id="order-phone"
                {...register("customer.phone")}
                className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
                placeholder="+996 700 123 456"
              />
              {errors.customer?.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.customer.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="order-city" className="mb-1 block text-sm font-medium">
                Город
              </label>
              <select
                id="order-city"
                value={cityMode}
                onChange={(e) => handleCityModeChange(e.target.value as CityMode)}
                className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
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
                  aria-label="Укажите ваш город"
                  className="mt-2 w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
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
                <label htmlFor="order-address" className="mb-1 block text-sm font-medium">
                  Адрес
                </label>
                <input
                  id="order-address"
                  {...register("customer.address")}
                  className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
                  placeholder="Улица, дом, квартира"
                />
                {errors.customer?.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.customer.address.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="order-comment" className="mb-1 block text-sm font-medium">
                Комментарий (необязательно)
              </label>
              <textarea
                id="order-comment"
                {...register("comment")}
                className="w-full border border-paomma-line bg-paomma-bg p-2 text-sm"
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

            <div className="border-t border-paomma-line pt-3 text-sm">
              <div className="flex justify-between font-medium">
                <span>Итого</span>
                <span>{totals.total.toLocaleString("ru-RU")} Сом</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState === "submitting"}
              className="bg-paomma-accent py-3 text-xs uppercase tracking-wide text-white transition hover:bg-paomma-accentDark disabled:opacity-60"
            >
              {submitState === "submitting" ? "Отправляем..." : "Оформить заказ"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

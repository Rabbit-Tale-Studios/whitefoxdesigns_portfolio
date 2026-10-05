import settings from "@/content/pricing.json";

export const serviceIds = ["logo", "businessCards", "priority"] as const;
export type ServiceId = (typeof serviceIds)[number];
export type ServicePrice = {
  price: number;
  amount: number;
  discountPercent: number;
  discountLabel: string;
};
type Pricing = Record<ServiceId, ServicePrice>;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parsePricing(value: unknown): Pricing {
  if (!record(value))
    throw new Error(
      "content/pricing.json must contain the three service settings.",
    );
  const result = {} as Pricing;
  for (const id of serviceIds) {
    const service = value[id];
    const fail = (field: string, message: string): never => {
      throw new Error(`content/pricing.json: ${id}.${field} ${message}`);
    };
    if (!record(service)) fail("price", "is missing.");
    const { price, discountPercent, discountLabel } = service as Record<
      string,
      unknown
    >;
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price > 1000000 ||
      Math.abs(price * 100 - Math.round(price * 100)) > 0.000001
    )
      fail(
        "price",
        "must be a positive number with no more than two decimal places.",
      );
    if (
      typeof discountPercent !== "number" ||
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    )
      fail("discountPercent", "must be a number from 0 to 100.");
    if (typeof discountLabel !== "string" || discountLabel.length > 60)
      fail("discountLabel", "must be text of up to 60 characters.");
    const base = price as number;
    const discount = discountPercent as number;
    result[id] = {
      price: base,
      amount:
        Math.round((Math.round(base * 100) * (100 - discount)) / 100) / 100,
      discountPercent: discount,
      discountLabel: (discountLabel as string).trim() || "Special offer",
    };
  }
  return result;
}

export const pricing = parsePricing(settings);

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function offerNote(service: ServicePrice): string {
  return service.discountPercent > 0
    ? ` (${service.discountLabel}: ${service.discountPercent}% off; regular price ${formatPrice(service.price)} USD)`
    : "";
}

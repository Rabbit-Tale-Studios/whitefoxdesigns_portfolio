import settings from "@/content/pricing.json";

export const serviceIds = ["logo", "businessCards", "priority"] as const;
export type ServiceId = (typeof serviceIds)[number];
type Discount = { discountPercent: number; discountLabel: string };
export type FixedPrice = Discount & {
  type: "fixed";
  price: number;
  amount: number;
};
export type RangePrice = Discount & {
  type: "range";
  price: number;
  maxPrice: number;
  amount: number;
  maxAmount: number;
};
export type PercentagePrice = Discount & {
  type: "percentage";
  percent: number;
  effectivePercent: number;
};
export type ServicePrice = FixedPrice | RangePrice | PercentagePrice;
type Pricing = {
  logo: FixedPrice;
  businessCards: RangePrice;
  priority: PercentagePrice;
};

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(id: ServiceId, field: string, message: string): never {
  throw new Error(`content/pricing.json: ${id}.${field} ${message}`);
}

function money(
  service: Record<string, unknown>,
  id: ServiceId,
  field: string,
): number {
  const value = service[field];
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0 ||
    value > 1000000 ||
    Math.abs(value * 100 - Math.round(value * 100)) > 0.000001
  )
    fail(
      id,
      field,
      "must be a positive number with no more than two decimal places.",
    );
  return value as number;
}

function discount(service: Record<string, unknown>, id: ServiceId): Discount {
  const { discountPercent, discountLabel } = service;
  if (
    typeof discountPercent !== "number" ||
    !Number.isFinite(discountPercent) ||
    discountPercent < 0 ||
    discountPercent > 100
  )
    fail(id, "discountPercent", "must be a number from 0 to 100.");
  if (typeof discountLabel !== "string" || discountLabel.length > 60)
    fail(id, "discountLabel", "must be text of up to 60 characters.");
  return {
    discountPercent: discountPercent as number,
    discountLabel: (discountLabel as string).trim() || "Special offer",
  };
}

function reduced(value: number, percent: number): number {
  return Math.round((Math.round(value * 100) * (100 - percent)) / 100) / 100;
}

export function parsePricing(value: unknown): Pricing {
  if (!record(value))
    throw new Error(
      "content/pricing.json must contain the three service settings.",
    );
  const services = {} as Record<ServiceId, Record<string, unknown>>;
  for (const id of serviceIds) {
    const service = value[id];
    if (!record(service)) fail(id, "settings", "are missing.");
    services[id] = service as Record<string, unknown>;
  }
  const logoDiscount = discount(services.logo, "logo");
  const logoPrice = money(services.logo, "logo", "price");
  const cardDiscount = discount(services.businessCards, "businessCards");
  const cardPrice = money(services.businessCards, "businessCards", "price");
  const cardMax = money(services.businessCards, "businessCards", "maxPrice");
  if (cardMax < cardPrice)
    fail(
      "businessCards",
      "maxPrice",
      "must be greater than or equal to price.",
    );
  const priorityDiscount = discount(services.priority, "priority");
  const percent = services.priority.percent;
  if (
    typeof percent !== "number" ||
    !Number.isFinite(percent) ||
    percent < 0 ||
    percent > 100
  )
    fail("priority", "percent", "must be a number from 0 to 100.");
  const priorityPercent = percent as number;
  return {
    logo: {
      ...logoDiscount,
      type: "fixed",
      price: logoPrice,
      amount: reduced(logoPrice, logoDiscount.discountPercent),
    },
    businessCards: {
      ...cardDiscount,
      type: "range",
      price: cardPrice,
      maxPrice: cardMax,
      amount: reduced(cardPrice, cardDiscount.discountPercent),
      maxAmount: reduced(cardMax, cardDiscount.discountPercent),
    },
    priority: {
      ...priorityDiscount,
      type: "percentage",
      percent: priorityPercent,
      effectivePercent: reduced(
        priorityPercent,
        priorityDiscount.discountPercent,
      ),
    },
  };
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

export function formatServicePrice(
  service: ServicePrice,
  discounted = true,
): string {
  if (service.type === "percentage")
    return `${discounted ? service.effectivePercent : service.percent}%`;
  const amount = discounted ? service.amount : service.price;
  if (service.type === "range") {
    const max = discounted ? service.maxAmount : service.maxPrice;
    if (max !== amount) return `${formatPrice(amount)}–${formatPrice(max)}`;
  }
  return formatPrice(amount);
}

export function offerNote(service: ServicePrice): string {
  if (service.discountPercent === 0) return "";
  const original =
    service.type === "percentage"
      ? `regular surcharge ${formatServicePrice(service, false)}`
      : `regular price ${formatServicePrice(service, false)} USD`;
  return ` (${service.discountLabel}: ${service.discountPercent}% off; ${original})`;
}

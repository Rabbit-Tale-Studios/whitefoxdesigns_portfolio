import { expect, test } from "bun:test";
import {
  formatPrice,
  formatServicePrice,
  offerNote,
  parsePricing,
} from "@/lib/pricing";

const settings = {
  logo: { price: 175, discountPercent: 0, discountLabel: "Special offer" },
  businessCards: {
    price: 20,
    maxPrice: 150,
    discountPercent: 0,
    discountLabel: "Special offer",
  },
  priority: { percent: 50, discountPercent: 0, discountLabel: "Special offer" },
};

test("fixed prices, ranges, and surcharges use their correct units", () => {
  const prices = parsePricing(settings);
  expect(prices.logo.amount).toBe(175);
  expect(prices.businessCards.amount).toBe(20);
  expect(prices.businessCards.maxAmount).toBe(150);
  expect(prices.priority.effectivePercent).toBe(50);
  expect(formatServicePrice(prices.logo)).toBe("$175");
  expect(formatServicePrice(prices.businessCards)).toBe("$20–$150");
  expect(formatServicePrice(prices.priority)).toBe("50%");
  expect(offerNote(prices.logo)).toBe("");
});

test("logo discounts preserve the regular price and leave other services unchanged", () => {
  const prices = parsePricing({
    ...settings,
    logo: {
      ...settings.logo,
      discountPercent: 20,
      discountLabel: "Autumn offer",
    },
  });
  expect(prices.logo.price).toBe(175);
  expect(prices.logo.amount).toBe(140);
  expect(prices.businessCards.amount).toBe(20);
  expect(prices.priority.effectivePercent).toBe(50);
  expect(offerNote(prices.logo)).toBe(
    " (Autumn offer: 20% off; regular price $175 USD)",
  );
});

test("discounts apply to both ends of a price range", () => {
  const prices = parsePricing({
    ...settings,
    businessCards: { ...settings.businessCards, discountPercent: 10 },
  });
  expect(prices.businessCards.amount).toBe(18);
  expect(prices.businessCards.maxAmount).toBe(135);
  expect(formatServicePrice(prices.businessCards)).toBe("$18–$135");
  expect(formatServicePrice(prices.businessCards, false)).toBe("$20–$150");
});

test("priority discounts reduce the surcharge percentage rather than showing a dollar fee", () => {
  const prices = parsePricing({
    ...settings,
    priority: { ...settings.priority, discountPercent: 20 },
  });
  expect(prices.priority.effectivePercent).toBe(40);
  expect(formatServicePrice(prices.priority)).toBe("40%");
  expect(offerNote(prices.priority)).toBe(
    " (Special offer: 20% off; regular surcharge 50%)",
  );
});

test("monetary discounts round to cents", () => {
  const prices = parsePricing({
    ...settings,
    businessCards: {
      ...settings.businessCards,
      price: 19.99,
      maxPrice: 49.99,
      discountPercent: 15,
    },
  });
  expect(prices.businessCards.amount).toBe(16.99);
  expect(prices.businessCards.maxAmount).toBe(42.49);
  expect(formatPrice(175)).toBe("$175");
});

test("invalid settings identify the exact field", () => {
  for (const price of [-1, 0, 1.234, "175", Number.NaN])
    expect(() =>
      parsePricing({ ...settings, logo: { ...settings.logo, price } }),
    ).toThrow("logo.price");
  for (const discountPercent of [-5, 101, "20", Number.POSITIVE_INFINITY])
    expect(() =>
      parsePricing({
        ...settings,
        logo: { ...settings.logo, discountPercent },
      }),
    ).toThrow("logo.discountPercent");
  expect(() =>
    parsePricing({
      ...settings,
      logo: { ...settings.logo, discountLabel: 123 },
    }),
  ).toThrow("logo.discountLabel");
  for (const maxPrice of [10, "150", Number.NaN])
    expect(() =>
      parsePricing({
        ...settings,
        businessCards: { ...settings.businessCards, maxPrice },
      }),
    ).toThrow("businessCards.maxPrice");
  for (const percent of [-1, 101, "50", Number.NaN])
    expect(() =>
      parsePricing({
        ...settings,
        priority: { ...settings.priority, percent },
      }),
    ).toThrow("priority.percent");
});

test("empty offer labels and free offers format clearly", () => {
  const prices = parsePricing({
    ...settings,
    businessCards: { ...settings.businessCards, discountPercent: 100 },
    priority: {
      ...settings.priority,
      discountPercent: 100,
      discountLabel: " ",
    },
  });
  expect(formatServicePrice(prices.businessCards)).toBe("$0");
  expect(prices.priority.effectivePercent).toBe(0);
  expect(prices.priority.discountLabel).toBe("Special offer");
});

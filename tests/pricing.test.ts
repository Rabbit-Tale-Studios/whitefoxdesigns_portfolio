import { expect, test } from "bun:test";
import { formatPrice, offerNote, parsePricing } from "@/lib/pricing";

const settings = {
  logo: { price: 150, discountPercent: 0, discountLabel: "Special offer" },
  businessCards: {
    price: 40,
    discountPercent: 0,
    discountLabel: "Special offer",
  },
  priority: { price: 70, discountPercent: 0, discountLabel: "Special offer" },
};

test("normal pricing has no offer and stays unchanged", () => {
  const prices = parsePricing(settings);
  expect(prices.logo.amount).toBe(150);
  expect(prices.businessCards.amount).toBe(40);
  expect(prices.priority.amount).toBe(70);
  expect(offerNote(prices.logo)).toBe("");
});

test("discounts affect only the chosen service and preserve the original price", () => {
  const prices = parsePricing({
    ...settings,
    logo: {
      ...settings.logo,
      discountPercent: 20,
      discountLabel: "Autumn offer",
    },
  });
  expect(prices.logo.price).toBe(150);
  expect(prices.logo.amount).toBe(120);
  expect(prices.businessCards.amount).toBe(40);
  expect(offerNote(prices.logo)).toBe(
    " (Autumn offer: 20% off; regular price $150 USD)",
  );
});

test("discount calculations round monetary values to cents", () => {
  const prices = parsePricing({
    ...settings,
    businessCards: {
      ...settings.businessCards,
      price: 19.99,
      discountPercent: 15,
    },
  });
  expect(prices.businessCards.amount).toBe(16.99);
  expect(formatPrice(prices.businessCards.amount)).toBe("$16.99");
  expect(formatPrice(150)).toBe("$150");
});

test("invalid prices and discounts report the exact field to correct", () => {
  for (const price of [-1, 0, 1.234, "150", Number.NaN])
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
});

test("empty offer labels get a readable default and 100 percent discounts work", () => {
  const prices = parsePricing({
    ...settings,
    priority: {
      ...settings.priority,
      discountPercent: 100,
      discountLabel: " ",
    },
  });
  expect(prices.priority.amount).toBe(0);
  expect(prices.priority.discountLabel).toBe("Special offer");
});

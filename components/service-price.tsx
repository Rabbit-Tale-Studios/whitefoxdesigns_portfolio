import { formatPrice, pricing, type ServiceId } from "@/lib/pricing";

export function ServicePrice({
  service,
  main = false,
  additional = false,
}: {
  service: ServiceId;
  main?: boolean;
  additional?: boolean;
}) {
  const price = pricing[service];
  const prefix = additional ? "+" : "";
  const discounted = price.discountPercent > 0;
  return (
    <div className="price-block" data-service={service}>
      {discounted && (
        <div className="price-offer">
          <span className="offer-label">
            {price.discountLabel} · {price.discountPercent}% off
          </span>
          <p className="original-price">
            Regular price{" "}
            <s>
              {prefix}
              {formatPrice(price.price)} USD
            </s>
          </p>
        </div>
      )}
      <p
        className={`${main ? "price" : "add-on-price"}${discounted ? " price-sale" : ""}`}
      >
        {prefix}
        {formatPrice(price.amount)}
        <span>USD{main ? " / single payment" : ""}</span>
      </p>
    </div>
  );
}

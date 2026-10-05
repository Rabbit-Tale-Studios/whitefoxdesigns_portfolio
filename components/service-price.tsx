import { formatServicePrice, pricing, type ServiceId } from "@/lib/pricing";

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
  const unit =
    price.type === "percentage"
      ? "additional"
      : `USD${main ? " / single payment" : ""}`;
  return (
    <div className="price-block" data-service={service}>
      {discounted && (
        <div className="price-offer">
          <span className="offer-label">
            {price.discountLabel} · {price.discountPercent}% off
          </span>
          <p className="original-price">
            {price.type === "percentage"
              ? "Regular surcharge"
              : "Regular price"}{" "}
            <s>
              {prefix}
              {formatServicePrice(price, false)}
              {price.type !== "percentage" ? " USD" : ""}
            </s>
          </p>
        </div>
      )}
      <p
        className={`${main ? "price" : "add-on-price"}${discounted ? " price-sale" : ""}`}
      >
        {prefix}
        {formatServicePrice(price)}
        <span>{unit}</span>
      </p>
    </div>
  );
}

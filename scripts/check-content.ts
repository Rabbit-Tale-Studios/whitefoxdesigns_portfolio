import { pricing, serviceIds } from "@/lib/pricing";

if (serviceIds.every((id) => pricing[id])) {
  console.log("Prices and discount settings are valid.");
}

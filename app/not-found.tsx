import Link from "next/link";
import { Arrow } from "@/components/icons";

export default function NotFound() {
  return (
    <main id="main-content" className="wrap not-found">
      <p className="eyebrow">404 / A LITTLE OFF THE PATH</p>
      <h1>
        This page
        <br />
        <span>got away.</span>
      </h1>
      <p>Let’s get you back to the good stuff.</p>
      <Link href="/" className="button">
        Back to the portfolio <Arrow />
      </Link>
    </main>
  );
}

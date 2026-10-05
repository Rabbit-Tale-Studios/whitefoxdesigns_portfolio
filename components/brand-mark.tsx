import Image from "next/image";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.svg"
      width={792}
      height={748}
      alt=""
      aria-hidden="true"
      className={`brand-mark ${className}`.trim()}
      unoptimized
    />
  );
}

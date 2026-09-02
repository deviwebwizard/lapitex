import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/lapitex_logo.png"
      alt="Lapitex IT Solutions"
      width={700}
      height={385}
      className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 ${className}`}
    />
  );
}

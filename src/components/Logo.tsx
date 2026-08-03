export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-baseline ${className} bg-gradient-to-r from-[#e1467c] to-[#f472a8] bg-clip-text text-transparent transition-all duration-300 leading-none`}>
      <span style={{ fontFamily: "var(--font-cinzel)" }} className="text-[1.4em] font-bold">L</span>
      <span style={{ fontFamily: "var(--font-orbitron)" }} className="font-black italic text-[1em] mx-[2px] tracking-wide">API</span>
      <span style={{ fontFamily: "var(--font-aesthetic)" }} className="font-normal text-[1.25em] tracking-normal ml-[2px]">tex</span>
    </span>
  );
}

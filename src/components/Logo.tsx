import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.webp";
import logoFallback from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  /** light = for use on dark backgrounds, dark = for use on light backgrounds */
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** When true, smoothly shrinks the logo (used by sticky header). */
  compact?: boolean;
  priority?: boolean;
}

// Per-breakpoint heights in pixels so the height transition can actually
// tween smoothly (Tailwind named sizes can't be interpolated by CSS).
const HEIGHTS: Record<NonNullable<LogoProps["size"]>, { base: number; sm: number; md: number; lg: number }> = {
  sm: { base: 24, sm: 28, md: 30, lg: 32 },
  md: { base: 30, sm: 34, md: 36, lg: 38 },
  lg: { base: 34, sm: 38, md: 42, lg: 44 },
};

export function Logo({
  className,
  variant = "dark",
  size = "md",
  compact,
  priority = false,
}: LogoProps) {
  const target = compact ? HEIGHTS.sm : HEIGHTS[size];

  // On the light header (variant "dark"), the header background is already
  // light — drop the white tile/shadow-sm so the logo doesn't visually "hang"
  // below the header. Keep the white tile only on dark surfaces (hero/footer).
  const bgClasses =
    variant === "light"
      ? "bg-white shadow-xl shadow-black/40 ring-1 ring-white/20"
      : "bg-transparent";

  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center rounded-xl px-1 py-1 sm:px-2 sm:py-1.5",
        "transition-[transform,box-shadow] duration-500 ease-out will-change-transform",
        "hover:scale-[1.03]",
        "motion-reduce:transition-none motion-reduce:transform-none motion-reduce:hover:scale-100",
        bgClasses,
        className,
      )}
      style={{
        // CSS vars consumed by the inner img element
        ["--logo-h-base" as string]: `${target.base}px`,
        ["--logo-h-sm" as string]: `${target.sm}px`,
        ["--logo-h-md" as string]: `${target.md}px`,
        ["--logo-h-lg" as string]: `${target.lg}px`,
      }}
      aria-label="Preciso de um Técnico - Início"
    >
      <picture>
        <source srcSet={logoImg} type="image/webp" />
        <img
          src={logoFallback}
          alt="Preciso de um Técnico"
          className={cn(
            "w-auto object-contain transition-[height] duration-500 ease-out motion-reduce:transition-none",
            "h-[var(--logo-h-base)] sm:h-[var(--logo-h-sm)] md:h-[var(--logo-h-md)] lg:h-[var(--logo-h-lg)]",
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
    </Link>
  );
}

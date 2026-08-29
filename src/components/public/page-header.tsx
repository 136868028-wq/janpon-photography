import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  imageSrc = "/images/header-banner.png",
  className,
  children,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-coal py-14 text-white sm:py-18", className)}>
      {/* Background Banner Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={imageSrc}
          alt="Star X-Press Photo Studio Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45 filter brightness-95"
        />
        {/* Multi-layer gradient overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/50 to-coal/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-coal/80 via-transparent to-coal/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {children ? (
          children
        ) : (
          title && (
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              subtitle={subtitle}
              className="[&_h2]:text-white [&_p]:text-white/80"
            />
          )
        )}
      </div>
    </section>
  );
}

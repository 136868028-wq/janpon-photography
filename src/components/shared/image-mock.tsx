import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MockImage } from "@/lib/mock-data";

/** Photo placeholder — real image when src is provided, else CSS gradient stand-in. */
export function ImageMock({
  image,
  className,
  rounded = true,
  aspect = "aspect-[4/3]",
  showCaption = true,
  objectFit = "cover",
}: {
  image: MockImage;
  className?: string;
  rounded?: boolean;
  aspect?: string;
  showCaption?: boolean;
  objectFit?: "cover" | "contain";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        rounded && "rounded-xl",
        aspect,
        className,
      )}
      role="img"
      aria-label={image.caption}
    >
      {image.src ? (
        <Image
          src={image.src}
          alt={image.caption}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(objectFit === "contain" ? "object-contain" : "object-cover")}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: image.gradient }}
        />
      )}
      {showCaption && image.caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10">
          <p className="text-xs text-white/85 font-medium">{image.caption}</p>
        </div>
      ) : null}
    </div>
  );
}
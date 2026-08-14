import { cn } from "@/lib/utils";
import type { MockImage } from "@/lib/mock-data";

/** Stand-in for real photography in mockups — no external images needed. */
export function ImageMock({
  image,
  className,
  rounded = true,
  aspect = "aspect-[4/3]",
}: {
  image: MockImage;
  className?: string;
  rounded?: boolean;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-cover bg-center",
        rounded && "rounded-xl",
        aspect,
        className,
      )}
      style={{ backgroundImage: image.gradient }}
      role="img"
      aria-label={image.caption}
    >
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10">
        <p className="text-xs text-white/85 font-medium">{image.caption}</p>
      </div>
    </div>
  );
}

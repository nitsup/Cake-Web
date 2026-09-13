import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  alt?: string;
  className?: string;
  priority?: boolean;
  src?: string | null;
}

export function ImagePlaceholder({ alt = "Cake placeholder", className, priority = false, src }: ImagePlaceholderProps) {
  return (
    <div
      className={cn("image-placeholder", src ? "image-placeholder--real" : null, className)}
      style={src ? { backgroundImage: `url(${JSON.stringify(src).slice(1, -1)})` } : undefined}
      role="img"
      aria-label={alt}
    >
      {src ? null : <Image src="/placeholders/cake-placeholder.svg" alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" />}
    </div>
  );
}

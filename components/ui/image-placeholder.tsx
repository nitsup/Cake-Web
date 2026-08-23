import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  alt?: string;
  className?: string;
  priority?: boolean;
}

export function ImagePlaceholder({ alt = "Cake placeholder", className, priority = false }: ImagePlaceholderProps) {
  return (
    <div className={cn("image-placeholder", className)}>
      <Image src="/placeholders/cake-placeholder.svg" alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" />
    </div>
  );
}

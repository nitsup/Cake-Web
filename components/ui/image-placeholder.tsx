"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  alt?: string;
  className?: string;
  positionX?: number;
  positionY?: number;
  priority?: boolean;
  src?: string | null;
  zoom?: number;
}

export function ImagePlaceholder({
  alt = "Cake placeholder",
  className,
  positionX = 50,
  positionY = 50,
  priority = false,
  src,
  zoom = 1,
}: ImagePlaceholderProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageAvailable = Boolean(src && src !== failedSrc);
  const imageStyle = {
    objectPosition: `${positionX}% ${positionY}%`,
    transform: `scale(${zoom})`,
  };

  return (
    <div
      className={cn("image-placeholder overflow-hidden", imageAvailable ? "image-placeholder--real" : null, className)}
      role="img"
      aria-label={alt}
    >
      {imageAvailable ? (
        <img
          src={src ?? ""}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform"
          style={imageStyle}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <Image src="/placeholders/cake-placeholder.svg" alt={alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 50vw" />
      )}
    </div>
  );
}

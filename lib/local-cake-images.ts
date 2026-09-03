const localPrimaryImages: Record<string, string> = {
  "birthday-cake-6-layers": "/cakes/birthday_rainbow_cake.png",
  "chocolate-cake": "/cakes/Good_choclate_cake.jpeg",
};

export function getLocalPrimaryImageUrl(slug: string): string | null {
  return localPrimaryImages[slug] ?? null;
}
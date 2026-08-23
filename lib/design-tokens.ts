export const designTokens = {
  breakpoints: { mobile: "0px", tablet: "768px", desktop: "1024px", wide: "1280px" },
  radii: { sm: "0.375rem", md: "0.625rem", lg: "1rem", full: "9999px" },
  shadows: { subtle: "0 1px 2px rgb(27 35 31 / 0.06)", card: "0 12px 30px rgb(27 35 31 / 0.08)", popover: "0 18px 45px rgb(27 35 31 / 0.14)" },
  motion: { fast: "150ms", normal: "220ms", slow: "360ms" },
} as const;

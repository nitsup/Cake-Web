import cancellationRefundContent from "@/content/legal/Cancelation&Refund";
import cookiesContent from "@/content/legal/Cookies";
import deliveryContent from "@/content/legal/Delivery_policy";
import disclaimerContent from "@/content/legal/disclaimer";
import privacyContent from "@/content/legal/Privacy_policy";
import termsContent from "@/content/legal/Terms&Conditions";

export type LegalDocumentKey =
  | "privacy"
  | "terms"
  | "cancellation-refund"
  | "delivery"
  | "cookies"
  | "disclaimer";

type LegalDocument = {
  title: string;
  content: string;
};

const documents: Record<LegalDocumentKey, LegalDocument> = {
  privacy: { title: "Privacy Policy", content: privacyContent },
  terms: { title: "Terms & Conditions", content: termsContent },
  "cancellation-refund": {
    title: "Cancellation & Refund Policy",
    content: cancellationRefundContent,
  },
  delivery: { title: "Delivery Policy", content: deliveryContent },
  cookies: {
    title: "Cookies, Analytics & Personalization",
    content: cookiesContent,
  },
  disclaimer: {
    title: "Development / Legal Disclaimer",
    content: disclaimerContent,
  },
};

export function getLegalDocument(key: LegalDocumentKey): LegalDocument {
  return documents[key];
}

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/cancellation-refund", label: "Cancellation & Refund Policy" },
  { href: "/delivery", label: "Delivery Policy" },
  { href: "/cookies", label: "Cookies, Analytics & Personalization" },
  { href: "/disclaimer", label: "Development / Legal Disclaimer" },
] as const;

export function isDevelopmentNoticeEnabled() {
  return process.env.NEXT_PUBLIC_DEVELOPMENT_NOTICE_ENABLED !== "false";
}

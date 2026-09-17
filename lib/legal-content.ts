import fs from "node:fs";
import path from "node:path";

export type LegalDocumentKey =
  | "privacy"
  | "terms"
  | "cancellation-refund"
  | "delivery"
  | "cookies"
  | "disclaimer";

type LegalDocument = {
  title: string;
  sourceFile: string;
  content: string;
};

const documents: Record<LegalDocumentKey, { title: string; sourceFile: string }> = {
  privacy: { title: "Privacy Policy", sourceFile: "Privacy_policy.txt" },
  terms: { title: "Terms & Conditions", sourceFile: "Terms&Conditions.txt" },
  "cancellation-refund": {
    title: "Cancellation & Refund Policy",
    sourceFile: "Cancelation&Refund.txt",
  },
  delivery: { title: "Delivery Policy", sourceFile: "Delivery_policy.txt" },
  cookies: {
    title: "Cookies, Analytics & Personalization",
    sourceFile: "Cookies.txt",
  },
  disclaimer: {
    title: "Development / Legal Disclaimer",
    sourceFile: "disclaimer.txt",
  },
};

export function getLegalDocument(key: LegalDocumentKey): LegalDocument {
  const document = documents[key];
  const filePath = path.join(
    process.cwd(),
    "content",
    "legal",
    document.sourceFile,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing private legal source file: ${document.sourceFile}`);
  }

  return {
    ...document,
    content: fs.readFileSync(filePath, "utf8"),
  };
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

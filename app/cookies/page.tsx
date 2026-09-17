import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Cookies, Analytics & Personalization", description: "Cake Web cookies, analytics, and personalization information." };

export default function CookiesPage() {
  const document = getLegalDocument("cookies");
  return <LegalDocument title={document.title} content={document.content} />;
}

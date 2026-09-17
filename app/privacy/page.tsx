import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Privacy Policy", description: "Cake Web Privacy Policy." };

export default function PrivacyPage() {
  const document = getLegalDocument("privacy");
  return <LegalDocument title={document.title} content={document.content} />;
}

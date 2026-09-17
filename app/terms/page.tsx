import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Terms & Conditions", description: "Cake Web Terms and Conditions." };

export default function TermsPage() {
  const document = getLegalDocument("terms");
  return <LegalDocument title={document.title} content={document.content} />;
}

import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Development / Legal Disclaimer", description: "Cake Web development and legal disclaimer." };

export default function DisclaimerPage() {
  const document = getLegalDocument("disclaimer");
  return <LegalDocument title={document.title} content={document.content} />;
}

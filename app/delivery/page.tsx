import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Delivery Policy", description: "Cake Web Delivery Policy." };

export default function DeliveryPage() {
  const document = getLegalDocument("delivery");
  return <LegalDocument title={document.title} content={document.content} />;
}

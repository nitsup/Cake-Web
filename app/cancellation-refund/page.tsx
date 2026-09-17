import { LegalDocument } from "@/components/legal/legal-document";
import { getLegalDocument } from "@/lib/legal-content";

export const metadata = { title: "Cancellation & Refund Policy", description: "Cake Web Cancellation and Refund Policy." };

export default function CancellationRefundPage() {
  const document = getLegalDocument("cancellation-refund");
  return <LegalDocument title={document.title} content={document.content} />;
}

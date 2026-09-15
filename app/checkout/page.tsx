import { redirect } from "next/navigation";
import { CheckoutPanel } from "@/components/checkout/checkout-panel";
import { createClient } from "@/lib/supabase/server";
import { prepareCheckoutForCurrentUser } from "@/services/checkout";

export const metadata = { title: "Checkout", description: "Review and place your Cake Web order." };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const preparation = await prepareCheckoutForCurrentUser();
  return (
    <div className="container py-16 md:py-24">
      <CheckoutPanel initialPreparation={preparation} />
    </div>
  );
}

import { redirect } from "next/navigation";
import { CartPanel } from "@/components/cart/cart-panel";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserCart } from "@/services/cart";

export const metadata = { title: "Cart", description: "Your Cake Web cart." };

export default async function CartPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return <div className="container py-16 md:py-24"><CartPanel initialCart={await getCurrentUserCart()} /></div>;
}

export const metadata = {
  title: "Preferences",
  description: "Your Cake Web preferences.",
};

export default async function PreferencesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return <div className="container py-16 md:py-24"><PersonalizationControl /></div>;
}
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PersonalizationControl } from "@/components/preferences/personalization-control";

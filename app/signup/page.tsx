import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Sign up",
  description: "Create a Cake Web account.",
};

export default function SignupPage() {
  return <div className="container py-16 md:py-24"><AuthForm mode="signup" /></div>;
}
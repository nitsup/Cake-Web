import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
  title: "Log in",
  description: "Log in to your Cake Web account.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialError = params.error === "callback" ? "That sign-in link is no longer valid. Please try again." : undefined;

  return <div className="container py-16 md:py-24"><AuthForm mode="login" initialError={initialError} /></div>;
}
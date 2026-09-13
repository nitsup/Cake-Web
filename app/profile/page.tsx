export const metadata = {
  title: "Profile",
  description: "Your Cake Web profile.",
};

export default function ProfilePage() {
  return (
    <div className="container py-16 md:py-24">
      <section className="state-panel mx-auto max-w-2xl">
        <p className="eyebrow">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Your profile is coming soon.</h1>
        <p className="mt-4 leading-7 text-muted-foreground">Profile details will be available in a future update.</p>
      </section>
    </div>
  );
}
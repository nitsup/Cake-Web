import { CakeCuttingLoader } from "@/components/ui/cake-cutting-loader";

export default function Loading() {
  return (
    <div className="container py-16 md:py-24">
      <CakeCuttingLoader label="Loading page" />
    </div>
  );
}

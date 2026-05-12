import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProductDetector from "@/components/ProductDetector";

export default async function ProductDetectorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ProductDetector />;
}

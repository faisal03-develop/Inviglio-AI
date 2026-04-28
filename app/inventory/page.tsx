import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import InventoryPageView from "@/pages/inventory-page";

export default async function InventoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <InventoryPageView />;
}

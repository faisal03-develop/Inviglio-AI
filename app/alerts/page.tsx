import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AlertsPageView from "@/pages/alerts-page";

export default async function AlertsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <AlertsPageView />;
}

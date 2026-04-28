import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardPageView from "@/pages/dashboard-page";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardPageView />;
}

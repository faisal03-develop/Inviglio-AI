import { SignOutButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Inviglio AI Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <SignOutButton><button
            type="button"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm transition hover:bg-zinc-900"
          >
            Sign out
          </button></SignOutButton>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Authentication status</p>
          <p className="mt-2 text-xl font-semibold text-emerald-400">
            Signed in
          </p>
        </article>
        <article className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">User ID</p>
          <p className="mt-2 break-all text-sm text-zinc-200">{userId}</p>
        </article>
      </section>
    </main>
  );
}

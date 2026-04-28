import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-4 sm:p-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg sm:p-6">
        {/* ClerkLoading provides a clear loading state while auth UI initializes */}
        <ClerkLoading>
          <div className="flex items-center justify-center py-10 text-sm text-zinc-600">
            Loading sign-in...
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          {/* SignIn includes built-in validation and error feedback */}
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </ClerkLoaded>
      </div>
    </main>
  );
}

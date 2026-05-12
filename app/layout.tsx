import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { WorkflowMetricsProvider } from "@/contexts/WorkflowMetricsContext";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inviglio AI",
  description: "AI-powered inventory management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider ui={ui}>
      <html
        lang="en"
        className={`${montserrat.variable} h-full antialiased`}
      >
        {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject attributes like cz-shortcut-listen on <body> */}
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <WorkflowMetricsProvider>{children}</WorkflowMetricsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

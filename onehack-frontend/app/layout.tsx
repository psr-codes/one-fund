import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import  NavBar from "@/components/Navbar"; // Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneHack CrowdFund",
  description: "90/10 Split Crowdfunding on OneChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>
          {/* We use the extracted NavBar here */}
          <NavBar />
          <main className="max-w-6xl mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
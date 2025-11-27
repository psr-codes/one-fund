import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import  NavBar from "@/components/Navbar"; // Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneFund - Crowdfunding on OneChain",
  description: "90/10 Split Crowdfunding on OneChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${inter.className} bg-gray-900 text-white `}> */}
      <body className={`${inter.className} bg-gradient-to-b from-green-900/20 to-gray-950 text-white `}>
        <Providers>
          {/* We use the extracted NavBar here */}
          <NavBar />
          <main className="mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
"use client"; // This directive fixes the error!

import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="p-4 border-b border-gray-700 flex justify-between items-center max-w-6xl mx-auto">
      <Link href="/" className="text-xl font-bold text-green-400">🚀 OneHack Fund</Link>
      <div className="flex gap-4 items-center">
          <Link href="/create" className="hover:text-green-300">Start Campaign</Link>
          <ConnectButton />
      </div>
    </nav>
  );
}
"use client";
import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", href: "/campaigns" },
    { name: "Start Campaign", href: "/create" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="OneFund Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-green-400 transition-colors">
            OneFund
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-green-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pl-6 border-l border-gray-800 cursor-pointer">
            <ConnectButton className="cursor-pointer"/>
          </div>
        </div>

        {/* --- MOBILE ACTION (Wallet + Burger) --- */}
        <div className="flex md:hidden items-center gap-4">
          <div className="scale-90">
             <ConnectButton className="cursor-pointer"/>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 absolute w-full left-0 top-20 shadow-2xl animate-in slide-in-from-top-5">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg font-medium ${
                  isActive(link.href) ? "text-green-400" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
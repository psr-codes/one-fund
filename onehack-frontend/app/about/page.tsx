"use client";
import Link from "next/link";
import { PACKAGE_ID, MODULE } from "@/config";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-20">
        <div className="w-full    flex justify-center">
          <Link href="https://onescan.cc/testnet/home" className="inline-block px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium hover:bg-green-500/20" target="_blank" >
            ✨ Powered by   <span className="bg-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
              OneChain
            </span> Infrastructure
          </Link>
        </div>
        {/* --- HERO SECTION --- */}
        <section className="text-center space-y-5">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Crowdfunding Reimagined on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
              OneChain
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            OneFund isn't just a fundraising tool; it's a demonstration of the
            speed, security, and efficiency of the OneChain ecosystem.
          </p>
          {/* <div className="flex justify-center gap-4 pt-4">
                <Link href="/create" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-green-900/20">
                    Start a Campaign
                </Link>
                <a href="https://onelabs.cc" target="_blank" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-bold border border-gray-700">
                    Explore OneChain
                </a>
            </div> */}
        </section>

        {/* --- THE PROBLEM & SOLUTION --- */}
        <section className="grid md:grid-cols-2 gap-12 items-center bg-gray-900/50 p-8 rounded-3xl border border-gray-800">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Why OneFund?</h2>
            <p className="text-gray-300 leading-relaxed">
              Traditional crowdfunding platforms are slow, charge high fees, and
              often hold funds in escrow for weeks. Donors never really know if
              their money reached the destination.
            </p>
            <p className="text-gray-300 leading-relaxed">
              OneFund solves this by leveraging{" "}
              <strong>blockchain transparency</strong> and{" "}
              <strong>atomic settlements</strong>.
            </p>
            <ul className="space-y-3">
              {[
                "Instant Payouts (No Lockups)",
                "Transparent & Auditable History",
                "Global Access with $OCT",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-green-300"
                >
                  <span className="bg-green-900/30 p-1 rounded-full text-xs">
                    ✓
                  </span>{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 p-8 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-bold text-white mb-4">
              Under the Hood
            </h3>
            <div className="space-y-4 text-sm text-gray-400 font-mono">
              <div className="bg-black/40 p-3 rounded border border-gray-700">
                <span className="text-blue-400">struct</span> Campaign &#123;{" "}
                <br />
                &nbsp;&nbsp;id: UID, <br />
                &nbsp;&nbsp;owner: address, <br />
                &nbsp;&nbsp;raised: u64 <br />
                &#125;
              </div>
              <p>
                We use a <strong>Shared Object</strong> architecture in Move to
                allow anyone to interact with a campaign simultaneously,
                preventing congestion.
              </p>
            </div>
          </div>
        </section>

        {/* --- WHY ONECHAIN? (The "Winning" Section) --- */}
        <section>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Powered by OneChain Infrastructure
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-colors">
              <div className="text-4xl mb-4">⚡️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Sub-Second Finality
              </h3>
              <p className="text-gray-400 text-sm">
                Donations on OneFund settle almost instantly. No waiting for
                block confirmations means a seamless UX comparable to Web2 apps.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-colors">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Move Language Security
              </h3>
              <p className="text-gray-400 text-sm">
                Built with Move's object-centric model. Assets are strictly
                typed resources, making it impossible to accidentally duplicate
                or "double-spend" donations.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-colors">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Low Gas Fees
              </h3>
              <p className="text-gray-400 text-sm">
                Micro-donations are actually viable. On OneChain, you don't pay
                $5 in gas to donate $1. Efficiency is built-in.
              </p>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="text-center pt-10 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-4">
            Built for the OneHack 2025 Hackathon
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 text-sm text-gray-300">
            <span>View Contract on</span>
            <a
              href={`https://onescan.cc/testnet/packageDetail?packageId=${PACKAGE_ID}`}
              target="_blank"
              className="text-blue-400 hover:underline font-bold"
            >
              OneScan ↗
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

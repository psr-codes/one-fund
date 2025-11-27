"use client";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID, MODULE } from "@/config";
import Link from "next/link";
import { useMemo } from "react";

export default function Home() {
  // 1. Fetch Events
  const { data, isPending, error } = useSuiClientQuery("queryEvents", {
    query: { MoveModule: { package: PACKAGE_ID, module: MODULE } },
    limit: 50,
    order: "descending",
  });

  // 2. Process Data
  const campaigns = useMemo(() => {
    if (!data) return [];
    return data.data.filter((e) => e.type.includes("::CampaignCreated"));
  }, [data]);

  const shortHash = (hash: string) =>
    hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "Unknown";

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center space-x-2">
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-75"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-20">Error loading data.</div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden  pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
            ✨ The #1 Web3 Crowdfunding Platform
          </div>
          
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Fund the Future <br />
              {/* The container holds the gradient text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                On
              </span>
              {/* The 'e' pops out in a different color (Yellow/Gold here) */}
              <span className="text-yellow-400 inline-block transform -rotate-12 mx-[1px]">
                e
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                -Chain.
              </span>
           </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Launch your idea in seconds. Receive crypto donations instantly. No
            intermediaries, just pure decentralized impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-full font-semibold text-lg transition-transform transform hover:-translate-y-0.5 shadow-xl shadow-green-900/30 focus:outline-none focus:ring-4 focus:ring-green-400/30"
              aria-label="Start Fundraising"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 -ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9-7-9-7-9 7 9 7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12v7"
                />
              </svg>
              <span className="leading-none">Start Fundraising</span>
            </Link>
            <a
              href="#campaigns"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full font-bold text-lg transition-all border border-gray-700"
            >
              Explore Projects
            </a>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="border-y border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">
              {campaigns.length}+
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
              Campaigns Launched
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
              Pass-Through (No Lockups)
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">0s</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
              Settlement Time
            </div>
          </div>
        </div>
      </div>

      {/* --- CAMPAIGNS GRID --- */}
      <div id="campaigns" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending on OneFund</h2>
            <p className="text-gray-400">
              Support verified builders and creators directly.
            </p>
          </div>
          {/* Optional: Filter buttons could go here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((event: any) => {
            const { campaign_id, title, target, owner } = event.parsedJson;
            const targetOCT = Number(target) / 1_000_000_000;
            const createdDate = event.timestampMs
              ? new Date(Number(event.timestampMs)).toLocaleDateString()
              : "Just now";

            return (
              <Link
                key={campaign_id}
                href={`/campaign/${campaign_id}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-900/20 transition-all duration-300 h-full flex flex-col">
                  {/* Card Header (Placeholder Image or Pattern) */}
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                    <span className="text-4xl">💡</span>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-green-400 border border-white/10">
                      Verified
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <span>📅 {createdDate}</span>
                      <span>•</span>
                      <span>By {shortHash(owner)}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                      {title}
                    </h3>

                    {/* Progress Bar (Visual Only - requires fetching raised data for real width) */}
                    <div className="mt-auto pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">Goal</span>
                        <span className="text-white font-bold">
                          {targetOCT} OCT
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-2 rounded-full"></div>{" "}
                        {/* Placeholder width */}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          OneChain Native
                        </span>
                        <span className="text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                          Donate Now →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="bg-gray-900 py-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How OneFund Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                📝
              </div>
              <h3 className="text-xl font-bold mb-3">1. Create</h3>
              <p className="text-gray-400">
                Launch a campaign in minutes. Set your goal and tell your story.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                📢
              </div>
              <h3 className="text-xl font-bold mb-3">2. Share</h3>
              <p className="text-gray-400">
                Share your campaign link. Accept OCT donations from anywhere.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                💸
              </div>
              <h3 className="text-xl font-bold mb-3">3. Receive</h3>
              <p className="text-gray-400">
                Funds are transferred directly to your wallet instantly. No
                waiting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

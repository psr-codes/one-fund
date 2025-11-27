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

  // 2. Process Data: Extract Campaigns + Calculate Raised Amounts from Donation Events
  const campaigns = useMemo(() => {
    if (!data) return [];

    // Separate Creation events and Donation events
    const createdEvents = data.data.filter((e) => e.type.includes("::CampaignCreated"));
    const donationEvents = data.data.filter((e) => e.type.includes("::DonationReceived"));

    // Map donation totals to campaign IDs
    const raisedMap: Record<string, number> = {};
    donationEvents.forEach((e: any) => {
        const { campaign_id, amount_donated } = e.parsedJson;
        raisedMap[campaign_id] = (raisedMap[campaign_id] || 0) + Number(amount_donated);
    });

    // Merge raised amount into campaign objects
    return createdEvents.map((e: any) => ({
        ...e,
        raised: raisedMap[e.parsedJson.campaign_id] || 0
    }));

  }, [data]);

  const shortHash = (hash: string) =>
    hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "Unknown";

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center space-x-2 bg-gray-950">
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
      <div className="relative overflow-hidden bg-gradient-to-b from-green-900/10 to-gray-950 pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium">
            ✨ The #1 Web3 Crowdfunding Platform
          </div>
          
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
              Fund the Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                On
              </span>
              <span className="text-white inline-block bg-green-600 px-2 rounded-md transform -rotate-6 mx-1 border border-green-400 shadow-lg shadow-green-500/50">
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
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-full font-bold text-lg transition-transform transform hover:-translate-y-1 shadow-xl shadow-green-900/40"
            >
              Start Fundraising
            </Link>
            <a
              href="#campaigns"
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-200 rounded-full font-bold text-lg transition-all border border-gray-800"
            >
              Explore Projects
            </a>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
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
            <div className="text-3xl font-bold text-white">~1s</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
              Settlement Time
            </div>
          </div>
        </div>
      </div>

      {/* --- CAMPAIGNS GRID --- */}
      <div id="campaigns" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending on OneFund</h2>
            <p className="text-gray-400">
              Support verified builders and creators directly.
            </p>
          </div>
          <Link href="/explore" className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1">
              View All Campaigns →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((event: any) => {
            const { campaign_id, title, target, owner } = event.parsedJson;
            const targetOCT = Number(target) / 1_000_000_000;
            const raisedOCT = event.raised / 1_000_000_000;
            const progress = Math.min((raisedOCT / targetOCT) * 100, 100);
            
            const createdDate = event.timestampMs
              ? new Date(Number(event.timestampMs)).toLocaleDateString()
              : "Just now";

            return (
              <Link
                key={campaign_id}
                href={`/campaign/${campaign_id}`}
                className="group"
              >
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 h-full flex flex-col">
                {/* Card Header */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                    <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">🌱</span>
                    
                    {/* Original Verified Tag */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-green-400 border border-white/10">
                      Verified
                    </div>

                    {/* NEW: Conditional Goal Reached Tag */}
                    {raisedOCT >= targetOCT && (
                        <div className="absolute top-4 left-4 bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-400 border border-yellow-500/30 flex items-center gap-1 shadow-lg shadow-yellow-900/20 animate-pulse">
                            <span>🎉</span> Goal Reached
                        </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-gray-500 bg-gray-950 px-2 py-1 rounded border border-gray-800">
                            {shortHash(owner)}
                        </span>
                        <span className="text-xs text-gray-500">{createdDate}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-green-400 transition-colors line-clamp-2 h-14">
                      {title}
                    </h3>

                    {/* Progress Bar (NOW FUNCTIONAL) */}
                    <div className="mt-auto pt-4 border-t border-gray-800">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-bold">{raisedOCT} OCT <span className="text-gray-500 font-normal">raised</span></span>
                        <span className="text-gray-400">{targetOCT} OCT goal</span>
                      </div>
                      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div> 
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
      <div className="bg-gray-900 py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16">How OneFund Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 bg-gray-950 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                📝
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">1. Create</h3>
              <p className="text-gray-400">
                Launch a campaign in minutes. Set your goal and tell your story.
              </p>
            </div>
            <div className="p-6 bg-gray-950 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                📢
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">2. Share</h3>
              <p className="text-gray-400">
                Share your campaign link. Accept OCT donations from anywhere.
              </p>
            </div>
            <div className="p-6 bg-gray-950 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                💸
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">3. Receive</h3>
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
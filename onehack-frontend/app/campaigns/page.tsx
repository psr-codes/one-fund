"use client";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID, MODULE } from "@/config";
import Link from "next/link";
import { useMemo, useState } from "react";

type FilterType = "newest" | "oldest" | "top" | "featured";

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("newest");

  // 1. Fetch Events
  const { data, isPending, error } = useSuiClientQuery("queryEvents", {
    query: { MoveModule: { package: PACKAGE_ID, module: MODULE } },
    limit: 50,
    order: "descending",
  });

  // 2. Process and Sort Data
  const campaigns = useMemo(() => {
    if (!data) return [];
    
    // Filter for CampaignCreated events
    let filtered = data.data.filter((e) => e.type.includes("::CampaignCreated"));

    // Apply Sorting Logic
    if (activeFilter === "newest") {
      filtered.sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs));
    } else if (activeFilter === "oldest") {
      filtered.sort((a, b) => Number(a.timestampMs) - Number(b.timestampMs));
    } else if (activeFilter === "top") {
      // Sort by Funding Goal (Target) High -> Low
      filtered.sort((a, b) => Number((b.parsedJson as any).target) - Number((a.parsedJson as any).target));
    } else if (activeFilter === "featured") {
      // Random shuffle for "Featured" look
      filtered = filtered.sort(() => Math.random() - 0.5);
    }

    return filtered;
  }, [data, activeFilter]);

  const shortHash = (hash: string) => (hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "Unknown");

  return (
    <div className="min-h-screen bg-gray-950 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-gray-800 pb-6">
            <div>
                <h1 className="text-4xl font-extrabold text-white mb-2">Explore Campaigns</h1>
                <p className="text-gray-400">Discover and fund the next big thing on OneChain.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex  bg-gray-900 p-1 rounded-lg border border-gray-800">
                {(["newest", "top", "oldest", "featured"] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                            activeFilter === f 
                            ? "bg-gray-800 text-white shadow-sm" 
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Loading / Error States */}
        {isPending && (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        )}
        
        {error && (
            <div className="text-center py-20 text-red-400 bg-red-900/10 rounded-xl border border-red-900/30">
                Error loading campaigns. Please try again later.
            </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((event: any) => {
             const { campaign_id, title, target, owner } = event.parsedJson;
             const targetOCT = Number(target) / 1_000_000_000;
             const createdDate = event.timestampMs ? new Date(Number(event.timestampMs)).toLocaleDateString() : "Just now";

             return (
               <Link key={campaign_id} href={`/campaign/${campaign_id}`} className="group">
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-300 h-full flex flex-col">
                      
                      {/* Placeholder Visual */}
                      <div className="h-48 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                          <div className="text-5xl opacity-20 grayscale group-hover:grayscale-0 transition-all">
                            🌱
                          </div>
                          {activeFilter === 'featured' && (
                              <div className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded border border-yellow-500/30">
                                  FEATURED
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

                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                              {title}
                          </h3>

                          {/* Stats Row */}
                          <div className="mt-auto pt-6 border-t border-gray-800 flex justify-between items-center">
                              <div>
                                  <p className="text-xs text-gray-500 mb-1">Goal</p>
                                  <p className="text-white font-bold">{targetOCT} OCT</p>
                              </div>
                              <span className="text-green-400 text-xs font-bold bg-green-900/20 px-3 py-1.5 rounded-full group-hover:bg-green-500 group-hover:text-black transition-all">
                                  View →
                              </span>
                          </div>
                      </div>
                  </div>
               </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
}
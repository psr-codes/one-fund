"use client";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { PACKAGE_ID, MODULE } from "@/config";
import Link from "next/link";

export default function Home() {
  // 1. Fetch "CampaignCreated" events to find all campaigns
  const { data, isPending, error } = useSuiClientQuery("queryEvents", {
    query: {
      MoveModule: { package: PACKAGE_ID, module: MODULE },
    },
    limit: 50,
    order: "descending",
  });

  if (isPending) return <div className="text-center mt-10">Loading Campaigns...</div>;
  if (error) return <div className="text-red-500 mt-10">Error: {error.message}</div>;

  // Filter only CampaignCreated events
  const campaigns = data?.data.filter((e) => e.type.includes("::CampaignCreated"));

  const shortHash = (hash: string) => {
    if (!hash) return "Unknown";
    return `${hash.slice(0, 7)}...${hash.slice(-7)}`;
  };


  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Ongoing Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((event: any) => {
           const { campaign_id, title, target, owner } = event.parsedJson;
           const createdDate = event.timestampMs
             ? new Date(Number(event.timestampMs)).toLocaleDateString()
             : "Just now";

           return (
             <Link key={campaign_id} href={`/campaign/${campaign_id}`}>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition cursor-pointer">
                    <h2 className="text-xl font-bold mb-2">{title}</h2>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-400 text-sm">Target: {target / 1e9} OCT</p>
                      <p className="text-gray-500 text-xs">Created: {createdDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Owner:</span>
                      {owner ? (
                        <p
                          // href={`https://onescan.cc/testnet/account?address=${owner}`}
                          // target="_blank"
                          // rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block"
                        >
                          <span className="bg-black text-green-300 px-2 py-1 rounded font-mono tracking-widest text-xs">
                            {shortHash(owner)}
                          </span>
                        </p>
                      ) : (
                        <span className="text-gray-500 text-xs">Unknown</span>
                      )}
                    </div>
                </div>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
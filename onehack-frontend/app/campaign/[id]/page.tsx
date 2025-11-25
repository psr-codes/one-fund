"use client";
import {
  useSuiClientQuery,
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE, COIN_TYPE } from "@/config";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/dist/client/link";

const decimals = 1_000_000_000;

export default function CampaignDetails() {
  const { id } = useParams();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const shortHash = (hash: string) => {
    // SAFETY CHECK: If hash is missing/null/undefined, stop immediately
    if (!hash) return "Unknown";
    return `${hash.slice(0, 7)}...${hash.slice(-7)}`;
  };
  const { data: objectData, refetch } = useSuiClientQuery("getObject", {
    id: id as string,
    options: { showContent: true },
  });

  const { data: eventsData } = useSuiClientQuery("queryEvents", {
    query: { MoveModule: { package: PACKAGE_ID, module: MODULE } },
    limit: 50,
    order: "descending",
  });

  const topDonors = useMemo(() => {
    if (!eventsData) return [];
    const relevantEvents = eventsData.data.filter(
      (e: any) =>
        (e.parsedJson as any)?.campaign_id === id &&
        e.type.includes("::DonationReceived")
    );
    const donorMap: Record<string, number> = {};
    relevantEvents.forEach((e: any) => {
      const { donor, amount_donated } = e.parsedJson;
      donorMap[donor] = (donorMap[donor] || 0) + Number(amount_donated);
    });
    return Object.entries(donorMap)
      .map(([donor, total]) => ({ donor, total }))
      .sort((a, b) => b.total - a.total);
  }, [eventsData, id]);

  const donate = async () => {
    if (!account) return alert("Please connect wallet first");
    if (!amount || parseFloat(amount) <= 0)
      return alert("Please enter a valid amount");

    setLoading(true);

    try {
      const tx = new Transaction();

      // 1. CALCULATE AMOUNTS
      const decimals = 1_000_000_000;
      const amountInMist = Math.floor(parseFloat(amount) * decimals);
      const GAS_BUFFER = 50_000_000; // 0.05 OCT for fees
      const totalNeeded = amountInMist + GAS_BUFFER;

      // 2. FETCH COINS (Get up to 50 small coins)
      const { data: coins } = await client.getCoins({
        owner: account.address,
        coinType: "0x2::oct::OCT",
        limit: 50,
      });

      if (coins.length === 0) throw new Error("No OCT coins found");

      // 3. SELECT COINS (The "Pile" Strategy)
      // We collect enough small coins to cover the donation + gas
      let currentBalance = 0;
      const paymentCoins = [];

      for (const coin of coins) {
        paymentCoins.push({
          objectId: coin.coinObjectId,
          version: coin.version,
          digest: coin.digest,
        });
        currentBalance += parseInt(coin.balance);
        if (currentBalance >= totalNeeded) break;
      }

      if (currentBalance < totalNeeded) {
        throw new Error(
          `Insufficient Balance. You have ${
            currentBalance / decimals
          } OCT, need ${totalNeeded / decimals} OCT.`
        );
      }

      // 4. SET GAS PAYMENT (The Fix)
      // We pass the ARRAY of coins. The network treats them as one big balance.
      tx.setGasPayment(paymentCoins);
      tx.setGasBudget(GAS_BUFFER);

      // 5. SPLIT FROM GAS
      // tx.gas now represents the Sum of all coins in paymentCoins
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountInMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::donate`,
        typeArguments: [COIN_TYPE],
        arguments: [tx.object(id as string), coin],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            alert("Donation Successful!");
            setLoading(false);
            refetch();
          },
          onError: (e) => {
            console.error(e);
            alert("Tx Failed: " + e.message);
            setLoading(false);
          },
        }
      );
    } catch (e: any) {
      alert(e.message);
      setLoading(false);
    }
  };

  if (!objectData?.data)
    return <div className="p-10 text-center">Loading Campaign...</div>;
//   console.log("object data is:", objectData.data);
//   console.log("owner  is:", objectData?.data?.content?.fields?.owner);
  const fields = (objectData.data.content as any).fields;

//   eventsData?.data.map((e: any) => {
//     console.log("events data is:", e);
//     console.log("events digest is:", e.id.txDigest);
//   });


// --- NEW: Find Creation Date ---
  const creationEvent = eventsData?.data.find(
    (e: any) => e.type.includes("::CampaignCreated") && (e.parsedJson as any)?.campaign_id === id
  );

  const createdDate = creationEvent 
    ? new Date(Number(creationEvent.timestampMs)).toLocaleDateString() 
    : "Just now";

console.log("creation date is:", createdDate);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            
          <h1 className="text-4xl font-bold mb-4">{fields.title}</h1>
          <p className="text-gray-300 text-lg mb-6">{fields.description}</p>

          {/* Creator / Owner + Creation date (compact row) */}
          <div className="flex items-center justify-between gap-4 mb-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Creator:</span>
              {fields.owner ? (
                <Link
                  href={`https://onescan.cc/testnet/account?address=${fields.owner}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <span className="bg-black text-green-300 px-2 py-1 rounded font-mono tracking-widest">
                    {shortHash(fields.owner)}
                  </span>
                </Link>
              ) : (
                <span className="text-gray-500">Unknown</span>
              )}
            </div>

            <div className="text-right flex flex-row justify-between items-center gap-2">
              <p className="text-gray-400 text-xs">Created on</p>
              <p className="text-gray-200 text-sm">{createdDate}</p>
            </div>
          </div>

          <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden mb-2">
            <div
              className="bg-green-500 h-full"
              style={{
                width: `${Math.min(
                  100,
                  (fields.raised / fields.target) * 100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Raised: {fields.raised / 1e9} OCT</span>
            <span>Goal: {fields.target / 1e9} OCT</span>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Support this Project</h3>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Amount (OCT)"
              className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded"
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={donate}
              disabled={loading}
              className="cursor-pointer bg-green-600 hover:bg-green-500 text-white font-bold px-8 rounded disabled:bg-gray-600"
            >
              {loading ? "Processing..." : "Donate"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">
            *90% goes to the project, 10% supports the platform.
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-h-[85vh] ">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
          🏆 Top Donors{" "}
        </h3>
        {topDonors.length === 0 ? (
          <p className="text-gray-500">No donations yet. Be the first!</p>
        ) : (
          <ul className="space-y-3">
            {topDonors.map((d, i) => (
              <li key={d.donor} className=" text-sm grid grid-cols-4 p-0 ">
                <Link
                  href={`https://onescan.cc/testnet/account?address=${d.donor}`}
                  className="  text-green-300 col-span-3   px-2 py-1 rounded hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                 <span className="tracking-widest font-mono"> {shortHash(d.donor)}</span>
                </Link>
                <span className="font-bold col-span-1 py-1 ">
                  {d.total / decimals} OCT
                </span>
                {/* <span className="">
                  {i + 1}. {d.donor.slice(0, 6)}...{d.donor.slice(-4)}
                </span> */}
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 mt-8">
          📜 Recent Activity
        </h3>
        <ul className="space-y-3 overflow-y-auto max-h-120 overflow-scroll ">
          {/* FIX: Filter for 'DonationReceived' only before mapping */}
          {eventsData?.data
            .filter((e: any) => e.type.includes("::DonationReceived"))
            .map((e: any) => (
              <li
                key={e.id.txDigest}
                className="flex justify-between items-center text-xs bg-gray-900 p-2 rounded"
              >
                <div>
                  <div className="text-green-400">
                    <a
                      href={`https://onescan.cc/testnet/transactionBlocksDetail?digest=${e.id.txDigest}`}
                      // href={`https://one-scan.onelabs.cc/tx/${e.digest}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      Tx: {shortHash(e.sender)} ↗
                    </a>
                  </div>
                  <div className="text-gray-500">
                    {new Date(Number(e.timestampMs)).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    {/* FIX: Ensure we divide by 1 billion for display */}
                    {Number(e.parsedJson.amount_donated) / 1_000_000_000} OCT
                  </div>
                  <div className="text-gray-500" title={e.parsedJson.donor}>
                    From: {shortHash(e.parsedJson?.donor)}{" "}
                  </div>
                </div>
              </li>
            ))}
        </ul>
        
      </div>
    </div>
  );
}

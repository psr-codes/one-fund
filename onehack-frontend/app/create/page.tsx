"use client";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE } from "@/config";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const client = useSuiClient(); 
  const account = useCurrentAccount(); 
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [formData, setFormData] = useState({ title: "", desc: "", target: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const create = async () => {
    if (!account) return alert("Please connect wallet first");
    setLoading(true);

    try {
      const tx = new Transaction();

      // --- FIX: FETCH 'OCT' COINS SPECIFICALLY ---
      const { data: coins } = await client.getCoins({ 
        owner: account.address,
        coinType: "0x2::oct::OCT", // <--- Explicitly requesting OCT
        limit: 5 
      });

      if (coins.length === 0) {
        throw new Error("No OCT tokens found! Please request funds from the OneChain faucet.");
      }

      // Force use of the first OCT coin for gas
      tx.setGasPayment([
        {
          objectId: coins[0].coinObjectId,
          version: coins[0].version,
          digest: coins[0].digest,
        },
      ]);
      
      tx.setGasBudget(10000000);
     const decimals = 1_000_000_000;
    const targetInMist = parseInt(formData.target) * decimals;

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE}::create_campaign`,
      arguments: [
        tx.pure.string(formData.title),
        tx.pure.string(formData.desc),
        tx.pure.u64(targetInMist), // Send 2,000,000,000 instead of 2
      ],
    });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            alert(`Campaign Created! Digest: ${result.digest}`);
            router.push("/"); 
          },
          onError: (err) => {
            console.error(err);
            alert("Error: " + err.message);
          },
        }
      );
    } catch (e: any) {
      console.error(e);
      alert("Setup Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-gray-800 p-8 rounded-xl border border-gray-700">
      <h1 className="text-2xl font-bold mb-6">Start a Fundraiser</h1>
      <div className="space-y-4">
        <input 
          placeholder="Campaign Title" 
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded"
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <textarea 
          placeholder="Description" 
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded"
          onChange={(e) => setFormData({...formData, desc: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Target Amount (OCT)" 
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded"
          onChange={(e) => setFormData({...formData, target: e.target.value})}
        />
        <button 
          onClick={create}
          disabled={loading}
          className={`w-full text-white font-bold p-3 rounded ${
            loading ? "bg-gray-600" : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? "Preparing Transaction..." : "Launch Campaign"}
        </button>
      </div>
    </div>
  );
}
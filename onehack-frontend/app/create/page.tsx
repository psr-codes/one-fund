"use client";
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE } from "@/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function CreatePage() {
  const client = useSuiClient(); 
  const account = useCurrentAccount(); 
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [formData, setFormData] = useState({ title: "", desc: "", target: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const create = async () => {
    if (!account) return alert("Please connect wallet first");
    if (!formData.title || !formData.desc || !formData.target) return alert("Please fill in all fields.");
    setLoading(true);

    try {
      const tx = new Transaction();

      const { data: coins } = await client.getCoins({ 
        owner: account.address,
        coinType: "0x2::oct::OCT", 
        limit: 5 
      });

      if (coins.length === 0) {
        throw new Error("No OCT tokens found! Please request funds from the OneChain faucet.");
      }

      tx.setGasPayment([
        {
          objectId: coins[0].coinObjectId,
          version: coins[0].version,
          digest: coins[0].digest,
        },
      ]);
      
      tx.setGasBudget(100000000); // Increased budget to be safe
     const decimals = 1_000_000_000;
    const targetInMist = parseInt(formData.target) * decimals;

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE}::create_campaign`,
      arguments: [
        tx.pure.string(formData.title),
        tx.pure.string(formData.desc),
        tx.pure.u64(targetInMist),
      ],
    });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            // show a friendly toast message (no digest)
            console.log("Campaign created successfully", result);
            showToast("Campaign Created!");
            router.push(`http://localhost:3000/campaign/${result.digest}`);
            // router.push('/');
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
    <div className="min-h-screen bg-gray-950 py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* --- Left Column: Text & Info --- */}
        <div className="text-white space-y-8">
            <div>
                <Link href="/" className="text-green-400 hover:underline flex items-center gap-2 mb-4 text-sm font-medium">
                    ← Back to Home
                </Link>
                <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                    Bring your ideas <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">to life on-chain.</span>
                </h1>
                <p className="text-xl text-gray-400 mt-4 max-w-lg leading-relaxed">
                    Start a decentralized fundraiser in minutes. No gatekeepers, instant payouts, and full transparency powered by OneChain.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-3xl mb-3">⚡️</div>
                    <h3 className="text-lg font-bold mb-2">Instant Payouts</h3>
                    <p className="text-gray-400 text-sm">Funds stream directly to your wallet. No waiting periods or lockups.</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-3xl mb-3">🛡️</div>
                    <h3 className="text-lg font-bold mb-2">Trustless & Secure</h3>
                    <p className="text-gray-400 text-sm">Powered by auditable smart contracts. Donors donate with confidence.</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-3xl mb-3">🌍</div>
                    <h3 className="text-lg font-bold mb-2">Global Reach</h3>
                    <p className="text-gray-400 text-sm">Accept OCT from anyone, anywhere in the world.</p>
                </div>
                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="text-3xl mb-3">✅</div>
                    <h3 className="text-lg font-bold mb-2">Simple Setup</h3>
                    <p className="text-gray-400 text-sm">Just fill out the form, sign the transaction, and you're live.</p>
                </div>
            </div>
        </div>

        {/* --- Right Column: The Form --- */}
        <div className="bg-gray-900 p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl shadow-green-900/10 relative overflow-hidden">
          
          {/* Subtle Gradient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl font-bold mb-8 text-white">Start Your Fundraiser</h2>
          
          <div className="space-y-6 relative z-10">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Campaign Title</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">💡</span>
                    <input 
                      id="title"
                      placeholder="e.g., Community Garden Project" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-950 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="desc" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                 <div className="relative">
                    <span className="absolute top-4 left-0 pl-4 flex items-start text-gray-500">📝</span>
                    <textarea 
                      id="desc"
                      placeholder="Tell your story. What will the funds be used for?" 
                      rows={5}
                      className="w-full pl-12 pr-4 py-4 bg-gray-950 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600 resize-none"
                      onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">Be descriptive and compelling.</p>
            </div>

            <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-2">Funding Goal</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold">OCT</span>
                    <input 
                      id="target"
                      type="number" 
                      placeholder="e.g., 100" 
                      className="w-full pl-14 pr-4 py-4 bg-gray-950 border border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
                      onChange={(e) => setFormData({...formData, target: e.target.value})}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter the total amount of OCT you need.</p>
            </div>

            <button 
              onClick={create}
              disabled={loading || !account}
              className={`cursor-pointer w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                loading || !account
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/30"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Creating Campaign...
                </span>
              ) : !account ? (
                "Connect Wallet to Continue"
              ) : (
                "Launch Campaign Now 🚀"
              )}
            </button>
            {!account && (
                <p className="text-xs text-center text-red-400 mt-4">You must connect your OneChain wallet first.</p>
            )}
             <p className="text-xs text-center text-gray-500 mt-4">
                 By launching, you agree to our Terms of Service. A network gas fee will apply.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
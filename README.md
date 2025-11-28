# 🚀 OneFund: Decentralized Crowdfunding on OneChain

![OneFund Banner](https://via.placeholder.com/1200x400.png?text=OneFund+Project+Banner)
<img width="1710" height="952" alt="image" src="https://github.com/user-attachments/assets/b89cd324-5bc4-4729-b8ae-6ec0859a8046" />

*(Replace above link with your actual project banner)*

**OneFund** is a transparent, non-custodial crowdfunding platform built on the **OneChain** Layer 1 blockchain. Unlike traditional platforms that hold funds in escrow, OneFund utilizes a **"pass-through" smart contract model** that streams donations instantly to creators while ensuring verifiable on-chain history.

### 🔗 Quick Links
- **🔴 Live Demo:** [http://one-fund.vercel.app](https://one-fund.vercel.app)
- **📜 Smart Contract (Testnet):** [View on OneScan](https://onescan.cc/testnet/packageDetail?packageId=0x77457c8bab7351fad714d80b0c33ffe9e150326648f4a686dc4188f9b37a18a6)
- **🎥 Demo Video:** [Video](https://drive.google.com/file/d/1IRjHFGeAJoH-v47wqIRE_jiWplk61_EJ/view?usp=sharing)

---

## 💡 The Problem & Solution

**The Problem:** Traditional fundraising platforms act as gatekeepers. They charge high fees, hold funds for weeks, and lack transparency regarding where the money actually goes.

**The Solution:** OneFund leverages the speed and security of **OneChain** to create a trustless environment:
1.  **Atomic Settlements:** Funds are split and transferred in the exact same transaction block.
2.  **No Custody:** The platform smart contract never holds user funds, eliminating rug-pull risks.
3.  **Transparency:** Every donation emits an indexed event, creating a permanent, auditable history on the blockchain.

---

## ✨ Key Features

* **⚡ Instant Campaign Creation:** Launch a fundraising campaign in seconds by interacting directly with the Move smart contract.
* **💸 Atomic Split Payments:** Our unique `donate` function automatically splits incoming $OCT:
    * **90%** goes instantly to the Campaign Creator.
    * **10%** goes to the Protocol (Sustainability Fee).
* **👛 OneWallet Integration:** Seamless connection, transaction signing, and account management using the Mysten dApp Kit.
* **📊 Real-Time Indexing:** The frontend listens for on-chain events (`CampaignCreated`, `DonationReceived`) to build dynamic leaderboards and progress bars without a centralized database.
* **🔍 Verifiable History:** Every donation card includes a direct link to the transaction hash on OneScan.

---

## 🛠 Tech Stack

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Styling:** TailwindCSS (Glassmorphism & Dark Mode)
* **Blockchain Integration:** `@mysten/dapp-kit` & `@mysten/sui.js`
* **State Management:** React Query (TanStack)

### Backend (Smart Contract)
* **Language:** Move
* **Network:** OneChain Testnet
* **Architecture:** Shared Object Model (allowing concurrent donations)

---

## 📜 Smart Contract Details

The heart of OneFund is the `crowdfund` module.

**Package ID:** `0x77457c8bab7351fad714d80b0c33ffe9e150326648f4a686dc4188f9b37a18a6`

### Core Logic (The Atomic Split)
Unlike Solidity contracts that often use a "Pull" pattern (deposit -> withdraw), OneFund uses a "Push" pattern.

```rust
// Simplified Move Logic
public entry fun donate<T>(campaign: &mut Campaign, mut payment: Coin<T>, ctx: &mut TxContext) {
    // 1. Calculate 10% Fee
    let commission_amount = coin::value(&payment) / 10;
    
    // 2. Split the Coin
    let commission_coin = coin::split(&mut payment, commission_amount, ctx);

    // 3. Transfer Instantly (No Vault)
    transfer::public_transfer(commission_coin, ADMIN_ADDRESS);
    transfer::public_transfer(payment, campaign.owner);
    
    // 4. Update State & Emit Event
    campaign.raised = campaign.raised + amount;
    event::emit(DonationReceived { ... });
}
```
## 📸 Screenshots

### 1. Explore Dashboard
Discover trending campaigns with real-time progress bars.

### 2. Campaign Creation
Simple, permissionless creation flow integrated with OneWallet.

### 3. Campaign Details & Donation
View top donors, recent transactions, and donate securely with a single click.

---

## 🚀 Getting Started Locally

To run **OneFund** on your local environment:

```bash
# Clone the repository
git clone https://github.com/psr-codes/onehack-frontend.git
cd onehack-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 👨‍💻 About The Developer

**Prakash Rawat — Hackathon Builder & Web3 Developer**

I am a passionate builder focused on creating intuitive and impactful user experiences powered by decentralized infrastructure.  
OneFund reflects my belief in how blockchain can modernize crowdfunding and improve transparent public-goods funding.

### 🔗 Connect with Me
- **GitHub:** https://github.com/psr-codes  
- **LinkedIn:** https://linkedin.com/in/prakash-rawat-dev  
- **Email:** prakash.rawat.dev@gmail.com



module onehack_crowdfund::crowdfund;

use one::coin::{Coin}; // Removed 'Self' to fix the unused alias warning
use one::event;
use std::string::{String};

// --- Errors ---
const EAmountTooLow: u64 = 0;

// --- Configuration ---
// Your Wallet Address (Receives 10% commission)
const ADMIN_ADDRESS: address = @0x6aab5af269952885e12db557a7e7b3b808476ea3aeb6986ca0fb5b2251d41e17;

// --- Structs ---

public struct Campaign has key, store {
    id: UID,
    owner: address,
    title: String,
    description: String,
    target: u64,
    raised: u64,
}

// --- Events ---

public struct CampaignCreated has copy, drop {
    campaign_id: address,
    owner: address,
    title: String,
    target: u64
}

public struct DonationReceived has copy, drop {
    campaign_id: address,
    donor: address,
    amount_donated: u64,
    amount_beneficiary: u64,
    amount_commission: u64
}

// --- Functions ---

public entry fun create_campaign(
    title: String, 
    description: String, 
    target: u64, 
    ctx: &mut TxContext
) {
    let sender = ctx.sender();
    
    let campaign = Campaign {
        id: object::new(ctx),
        owner: sender,
        title,
        description,
        target,
        raised: 0
    };

    event::emit(CampaignCreated {
        campaign_id: object::uid_to_address(&campaign.id),
        owner: sender,
        title: title,
        target: target
    });

    transfer::share_object(campaign);
}

// UPDATED: Now accepts <T> (Any Coin Type)
public entry fun donate<T>(
    campaign: &mut Campaign, 
    mut payment: Coin<T>, 
    ctx: &mut TxContext
) {
    let amount = payment.value();
    assert!(amount > 10, EAmountTooLow); 

    let sender = ctx.sender();

    // 10% Commission
    let commission_amount = amount / 10;
    
    // Split the coin
    let commission_coin = payment.split(commission_amount, ctx);

    // Send 10% to YOU
    transfer::public_transfer(commission_coin, ADMIN_ADDRESS);

    // Send 90% to Campaign Owner
    transfer::public_transfer(payment, campaign.owner);

    // Update Campaign State
    campaign.raised = campaign.raised + amount;

    event::emit(DonationReceived {
        campaign_id: object::uid_to_address(&campaign.id),
        donor: sender,
        amount_donated: amount,
        amount_beneficiary: amount - commission_amount,
        amount_commission: commission_amount
    });
}
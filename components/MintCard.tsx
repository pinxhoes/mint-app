'use client';

import { NFTMintCard } from '@coinbase/onchainkit/nft';
import {
    NFTAssetCost,
    NFTCollectionTitle,
    NFTCreator,
    NFTMintButton,
    NFTQuantitySelector,
} from '@coinbase/onchainkit/nft/mint';
import { NFTMedia } from '@coinbase/onchainkit/nft/view';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';

// Define the LifecycleStatus type based on the documentation
type LifecycleStatusName =
    | 'init'
    | 'error'
    | 'mediaLoading'
    | 'mediaLoaded'
    | 'transactionPending'
    | 'transactionLegacyExecuted'
    | 'success';

type LifecycleStatus = {
    statusName: LifecycleStatusName;
    statusData: unknown;
};

interface MintCardProps {
    contractAddress: string;
    tokenId?: string;
}

export function MintCard({ contractAddress, tokenId }: MintCardProps) {
    const { isConnected } = useAccount();
    const formattedAddress = contractAddress as `0x${string}`;
    const [lifecycleStatus, setLifecycleStatus] = useState<LifecycleStatusName>('init');

    // Track the status of the mint process with proper typing
    const handleStatus = (status: LifecycleStatus) => {
        console.log("Mint status:", status);
        setLifecycleStatus(status.statusName);
    };

    return (
        <NFTMintCard
            contractAddress={formattedAddress}
            tokenId={tokenId}
            className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-md"
            onStatus={handleStatus}
        >
            <NFTCreator className="text-muted-foreground text-sm" />
            <NFTMedia className="rounded-lg border border-border" />
            <NFTCollectionTitle className="text-foreground font-semibold text-lg" />
            <NFTQuantitySelector className="bg-muted text-muted-foreground p-2 rounded-md" />
            <NFTAssetCost className="text-foreground font-medium" />

            {/* Hidden NFTMintButton to handle the actual minting logic */}
            <div style={{ display: 'none' }}>
                <NFTMintButton />
            </div>

            {/* Custom styled button for better visibility */}
            {isConnected ? (
                <button
                    onClick={() => {
                        // Find and click the hidden mint button
                        const mintButton = document.querySelector('[data-mint-button="true"]');
                        if (mintButton instanceof HTMLElement) {
                            mintButton.click();
                        }
                    }}
                    disabled={lifecycleStatus === 'transactionPending'}
                    className="w-full mt-4 py-2 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                    {lifecycleStatus === 'transactionPending' ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Minting...
                        </div>
                    ) : (
                        "Mint NFT"
                    )}
                </button>
            ) : (
                <div className="mt-4">
                    <ConnectWallet className="w-full py-2 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" />
                </div>
            )}
        </NFTMintCard>
    );
}
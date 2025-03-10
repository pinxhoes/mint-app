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

interface MintCardProps {
    contractAddress: string;
    tokenId?: string;
}

export function MintCard({ contractAddress, tokenId }: MintCardProps) {
    const formattedAddress = contractAddress as `0x${string}`;

    return (
        <NFTMintCard
            contractAddress={formattedAddress}
            tokenId={tokenId}
            className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-md"
        >
            <NFTCreator className="text-muted-foreground text-sm" />
            <NFTMedia className="rounded-lg border border-border" />
            <NFTCollectionTitle className="text-foreground font-semibold text-lg" />
            <NFTQuantitySelector className="bg-muted text-muted-foreground p-2 rounded-md" />
            <NFTAssetCost className="text-primary font-medium" />
            <NFTMintButton className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition" />
        </NFTMintCard>
    );
}
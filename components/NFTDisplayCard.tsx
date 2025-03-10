'use client'

import { NFTCard } from '@coinbase/onchainkit/nft';
import {
    NFTLastSoldPrice,
    NFTMedia,
    NFTNetwork,
    NFTOwner,
    NFTTitle,
} from '@coinbase/onchainkit/nft/view';

interface NFTDisplayCardProps {
    contractAddress: string;
    tokenId: string;
}

export function NFTDisplayCard({ contractAddress, tokenId }: NFTDisplayCardProps) {
    const formattedAddress = contractAddress as `0x${string}`;

    return (
        <NFTCard
            contractAddress={formattedAddress}
            tokenId={tokenId}
        >
            <NFTMedia />
            <NFTTitle />
            <NFTOwner />
            <NFTLastSoldPrice />
            <NFTNetwork />
        </NFTCard>
    );
}

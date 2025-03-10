'use client';

import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'wagmi/chains';

// Simplified ERC721 ABI with just the functions we need
const ERC721_ABI = [
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'index', type: 'uint256' },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
];

// Create a public client to interact with the blockchain
const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia;
const publicClient = createPublicClient({
    chain,
    transport: http(),
});

/**
 * Gets all token IDs owned by a specific address for a given contract
 * Note: This requires your contract to implement ERC721Enumerable
 */
export async function getNFTsOwnedByAddress(contractAddress: string, ownerAddress: string): Promise<string[]> {
    try {
        // Get the balance (number of NFTs owned by this address)
        const balance = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'balanceOf',
            args: [ownerAddress],
        }) as bigint;

        // If balance is 0, return empty array
        if (balance === 0n) {
            return [];
        }

        // Get all token IDs
        const tokenPromises: Promise<bigint>[] = [];
        for (let i = 0; i < Number(balance); i++) {
            tokenPromises.push(
                publicClient.readContract({
                    address: contractAddress as `0x${string}`,
                    abi: ERC721_ABI,
                    functionName: 'tokenOfOwnerByIndex',
                    args: [ownerAddress, BigInt(i)],
                }) as Promise<bigint>
            );
        }

        const tokenIds = await Promise.all(tokenPromises);
        return tokenIds.map(id => id.toString());
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
}
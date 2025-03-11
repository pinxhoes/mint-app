'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { NFTDisplayCard } from '@components/NFTDisplayCard';
import { ThemeToggle } from '@components/ThemeToggle';
import { getNFTsOwnedByAddress } from '@utils/nft-utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

// This is a placeholder. Replace with your actual deployed contract address
const NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function CollectionPage() {
    const { address, isConnected } = useAccount();
    const [tokenIds, setTokenIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchNFTs() {
            if (isConnected && address) {
                setIsLoading(true);
                try {
                    // Fetch the user's NFTs from the contract
                    const userNFTs = await getNFTsOwnedByAddress(NFT_CONTRACT_ADDRESS, address);
                    setTokenIds(userNFTs);
                } catch (error) {
                    console.error('Error fetching NFTs:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTokenIds([]);
                setIsLoading(false);
            }
        }

        fetchNFTs();
    }, [address, isConnected]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Stoopid Collection</h1>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/create"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            Create Mint
                        </Link>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Mint Page
                        </Link>
                        <ThemeToggle />
                        <ConnectWallet />
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                {!isConnected ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            Connect Your Wallet
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Connect your wallet to view your NFT collection.
                        </p>
                        <div className="inline-block">
                            <ConnectWallet />
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your NFTs...</span>
                    </div>
                ) : tokenIds.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                            No NFTs Found
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            You dont have any NFTs in this collection yet.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Mint Your First NFT
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tokenIds.map((tokenId) => (
                            <div key={tokenId} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
                                <NFTDisplayCard
                                    contractAddress={NFT_CONTRACT_ADDRESS}
                                    tokenId={tokenId}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 NFT Minting App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
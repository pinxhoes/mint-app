'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { ThemeToggle } from '@components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
// Import from the correct path
import { setOnchainKitConfig } from '@coinbase/onchainkit';
import { buildMintTransaction, getMintDetails, getTokenDetails } from '@coinbase/onchainkit/api';

// Define flexible interfaces for API responses
interface TokenDetailsResponse {
    name?: string;
    description?: string;
    imageUrl?: string;
    symbol?: string;
}

interface MintDetailsResponse {
    price?: string | number;
    totalSupply?: string | number;
    minted?: string | number;
    mintedCount?: string | number;
    supply?: string | number;
}

// This component would be placed at src/app/create/mint/[deployedAddress]/page.tsx
export default function MintPage({ params }: { params: { deployedAddress: string } }) {
    const { address, isConnected } = useAccount();
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isMinting, setIsMinting] = useState(false);

    // NFT Data state
    const [nftData, setNftData] = useState({
        name: "",
        symbol: "",
        description: "",
        imageUrl: "",
        price: "0",
        totalSupply: "0",
        minted: "0",
        creatorAddress: "",
        editionType: "EDITION",
    });

    // Get the contract address from the URL
    const contractAddress = params.deployedAddress as `0x${string}`;

    // Set OnchainKit config if you have an API key
    useEffect(() => {
        // This should be set once in your app, typically in a provider component
        if (process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY) {
            setOnchainKitConfig({
                apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY
            });
        }
    }, []);

    // Fetch NFT data using OnchainKit's functions
    useEffect(() => {
        async function fetchNFTData() {
            if (!contractAddress) return;

            setIsLoading(true);
            try {
                // Get token details
                const tokenDetailsResponse = await getTokenDetails({
                    contractAddress,
                });

                // Get mint details
                const mintDetailsResponse = await getMintDetails({
                    contractAddress,
                    takerAddress: address,
                });

                // Log the responses to see their structure
                console.log('Token Details Response:', tokenDetailsResponse);
                console.log('Mint Details Response:', mintDetailsResponse);

                // Cast to our interfaces to work with the data safely
                const tokenDetails = tokenDetailsResponse as TokenDetailsResponse;
                const mintDetails = mintDetailsResponse as MintDetailsResponse;

                // Extract values with fallbacks
                const name = tokenDetails.name || "Unknown NFT";
                const description = tokenDetails.description || "No description available";
                const imageUrl = tokenDetails.imageUrl || '/placeholder-nft.jpg';

                // Try to get symbol from various possible properties
                const symbol = tokenDetails.symbol || "NFT";

                // Format price (might be string or number)
                const price = typeof mintDetails.price === 'number'
                    ? mintDetails.price.toString()
                    : mintDetails.price || "0";

                // Try to get supply data from various possible properties
                const totalSupply = mintDetails.totalSupply?.toString() ||
                    mintDetails.supply?.toString() ||
                    "0";

                const minted = mintDetails.minted?.toString() ||
                    mintDetails.mintedCount?.toString() ||
                    "0";

                // Update state with the fetched data
                setNftData({
                    name,
                    symbol,
                    description,
                    imageUrl,
                    price,
                    totalSupply,
                    minted,
                    creatorAddress: contractAddress.substring(0, 6) + '...' + contractAddress.substring(contractAddress.length - 4),
                    editionType: "EDITION",
                });

            } catch (error) {
                console.error('Error fetching NFT data:', error);
                // Use fallback data in case of error
                setNftData({
                    name: "Failed to load",
                    symbol: "ERROR",
                    description: "Could not load NFT data",
                    imageUrl: '/placeholder-nft.jpg',
                    price: "0",
                    totalSupply: "0",
                    minted: "0",
                    creatorAddress: contractAddress.substring(0, 6) + '...',
                    editionType: "EDITION",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchNFTData();
    }, [contractAddress, address]);

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Mint function using OnchainKit's buildMintTransaction
    const handleMint = async () => {
        if (!isConnected || !address) return;

        setIsMinting(true);
        try {
            // Build the mint transaction using OnchainKit
            const mintTransactionResponse = await buildMintTransaction({
                mintAddress: contractAddress, // The contract address
                takerAddress: address, // The user's address
                quantity: quantity,
                network: process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
                    ? 'networks/base-mainnet'
                    : 'networks/base-sepolia',
            });

            // Log the response to see its structure
            console.log("Mint Transaction Response:", mintTransactionResponse);

            // Since we're using a flexible approach, we'll handle the response generically
            if (mintTransactionResponse && 'error' in mintTransactionResponse) {
                throw new Error(mintTransactionResponse.error as string);
            }

            // For now, we'll just simulate a successful mint
            console.log("Transaction built successfully");
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log(`Minted ${quantity} NFTs successfully!`);
            // After successful mint, you'd update the UI or redirect

        } catch (error) {
            console.error('Error minting NFT:', error);
        } finally {
            setIsMinting(false);
        }
    };

    // Calculate total price
    const totalPrice = parseFloat(nftData.price) * quantity;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stoopid App</h1>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/create"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors duration-300"
                        >
                            Create Mint
                        </Link>
                        <Link
                            href="/collection"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            My Collection
                        </Link>
                        <ThemeToggle />
                        <ConnectWallet />
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Left side - NFT image and details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {nftData.name}
                            </h1>

                            <div className="flex items-center mb-4">
                                <div className="flex items-center mr-4">
                                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-purple-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{nftData.creatorAddress}</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
                                <div className="aspect-square relative">
                                    <Image
                                        src={nftData.imageUrl}
                                        alt={nftData.name}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="inline-flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                                        ${nftData.symbol}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{nftData.editionType}</span>
                                </div>

                                <div className="prose prose-sm dark:prose-invert mb-6 whitespace-pre-wrap">
                                    {nftData.description}
                                </div>

                                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">EDITION PRICE</p>
                                        <p className="text-lg font-bold">{nftData.price} ETH</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">TOTAL SUPPLY</p>
                                        <p className="text-lg font-bold">{nftData.totalSupply}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Mint interface */}
                        <div className="lg:pt-16">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Mint NFT
                                </h2>

                                {!isConnected ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                                            Connect your wallet to mint this NFT
                                        </p>
                                        <ConnectWallet className="mx-auto" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your wallet</p>
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mr-2"></div>
                                                <span className="font-mono">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quantity</p>
                                            <div className="flex border border-gray-300 dark:border-gray-600 rounded-md w-full">
                                                <button
                                                    onClick={decreaseQuantity}
                                                    disabled={quantity <= 1}
                                                    className="px-4 py-2 border-r border-gray-300 dark:border-gray-600 disabled:opacity-50"
                                                >
                                                    -
                                                </button>
                                                <div className="flex-1 flex items-center justify-center">
                                                    {quantity}
                                                </div>
                                                <button
                                                    onClick={increaseQuantity}
                                                    className="px-4 py-2 border-l border-gray-300 dark:border-gray-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-700 dark:text-gray-300">Price per NFT</span>
                                                <span className="font-medium">{nftData.price} ETH</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-700 dark:text-gray-300">Quantity</span>
                                                <span className="font-medium">{quantity}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                                <span className="font-bold">Total</span>
                                                <span className="font-bold">{totalPrice.toFixed(3)} ETH</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleMint}
                                            disabled={isMinting}
                                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded transition-colors duration-300 disabled:opacity-50"
                                        >
                                            {isMinting ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                                    Minting...
                                                </div>
                                            ) : (
                                                `Mint - ${totalPrice.toFixed(3)} ETH`
                                            )}
                                        </button>

                                        <div className="mt-4 text-center">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {nftData.minted} / {nftData.totalSupply} minted
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 Stoopid Minting App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
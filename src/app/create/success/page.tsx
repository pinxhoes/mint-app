'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { ThemeToggle } from '@components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CreateSuccessPage() {
    const searchParams = useSearchParams();

    // Get collection details from URL params
    const name = searchParams.get('name') || 'Your Collection';
    const symbol = searchParams.get('symbol') || 'SYMBOL';
    const description = searchParams.get('description') || '';
    const price = searchParams.get('price') || '0.1';
    const supply = searchParams.get('supply') || '1';
    const imageUrl = searchParams.get('imageUrl') || '/placeholder-nft.jpg';
    const network = searchParams.get('network') || 'Base';

    // Mock contract address
    const deployedAddress = "0xb4703a3a73aec16e764cbd210b0fde9efdab8941";

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left side - NFT Image and Details */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-square relative overflow-hidden">
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {name}
                                </h2>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="inline-flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                                        ${symbol}
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">EDITION</span>
                                </div>

                                <div className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">
                                    {description}
                                </div>

                                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">EDITION PRICE</p>
                                        <p className="text-lg font-bold">{price} ETH</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">TOTAL SUPPLY</p>
                                        <p className="text-lg font-bold">{supply}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Success message and actions */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Collection created
                            </h2>

                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                Successfully deployed {name} on {network}.
                                Your collection has a built-in theme and website - visit it now
                            </p>

                            <div className="space-y-4">
                                <Link
                                    href={`/create/mint/${deployedAddress}`}
                                    className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded text-center transition-colors duration-300"
                                >
                                    Visit Mint Page
                                </Link>

                                <Link
                                    href="/collection"
                                    className="block w-full bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-4 rounded text-center border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                                >
                                    Manage Collection
                                </Link>
                            </div>

                            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                                <p>View contract on <a href={`https://basescan.org/address/${deployedAddress}`} className="text-blue-600 hover:underline">Basescan</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 Stoopid Minting App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
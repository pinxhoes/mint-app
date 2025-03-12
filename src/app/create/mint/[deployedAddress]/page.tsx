'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { ThemeToggle } from '@components/ThemeToggle';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function MintPage() {
    const { address, isConnected } = useAccount();
    const searchParams = useSearchParams();

    // Get NFT details from URL params
    const name = searchParams.get('name') || 'NFT Title';
    const description = searchParams.get('description') || 'No description available.';
    const imageUrl = searchParams.get('imageUrl') || '/placeholder-nft.jpg';
    const price = searchParams.get('price') || '0.1';
    const totalSupply = searchParams.get('totalSupply') || '1';
    const minted = searchParams.get('minted') || '0';
    const deployedAddress = searchParams.get('deployedAddress') || '0x000...0000';

    const maxPerWallet = 3;

    const [isMinting, setIsMinting] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showMintModal, setShowMintModal] = useState(false);
    const [mintQuantity, setMintQuantity] = useState(1);
    const [customQuantity, setCustomQuantity] = useState("");

    const calculateTotal = (qty: number) => {
        const priceValue = parseFloat(price);
        const platformFee = 0.0002; // Fee per NFT
        return {
            subtotal: (priceValue * qty).toFixed(4),
            fee: (platformFee * qty).toFixed(4),
            total: (priceValue * qty + platformFee * qty).toFixed(4)
        };
    };

    const totals = calculateTotal(mintQuantity);

    const handleMint = async () => {
        setIsMinting(true);
        try {
            // Simulate minting process
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log(`Minted 1 NFT successfully!`);
        } catch (error) {
            console.error('Error minting:', error);
        } finally {
            setIsMinting(false);
        }
    };

    const handleOpenMintModal = () => {
        if (isConnected) {
            setShowMintModal(true);
            setMintQuantity(1); // Reset to 1 when opening
            setCustomQuantity("");
        }
    };

    const handleQuantitySelect = (qty: number | "custom") => {
        if (qty === "custom") {
            setMintQuantity(parseInt(customQuantity) || 1);
        } else {
            setMintQuantity(qty);
            setCustomQuantity("");
        }
    };

    const handleCustomQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomQuantity(value);
        if (value) {
            const numValue = parseInt(value);
            if (!isNaN(numValue) && numValue > 0 && numValue <= maxPerWallet) {
                setMintQuantity(numValue);
            }
        }
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isDropdownOpen && !target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stoopid App</h1>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <ConnectWallet />
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left side - NFT Image */}
                    <div>
                        <Image src={imageUrl} alt={name} width={600} height={600} className="rounded-lg shadow-lg dark:bg-gray-800" />
                    </div>

                    {/* Right side - NFT Details */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

                        {/* Creator Contract & Dropdown */}
                        <div className="flex items-center justify-between mb-4 relative">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Creator Contract: {deployedAddress}</p>
                            <button
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                ⋮
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-10">
                                    <a href={`https://basescan.org/address/${deployedAddress}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">View on Basescan</a>
                                    <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left" onClick={() => navigator.clipboard.writeText(deployedAddress)}>
                                        Copy Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mint Button & Supply */}
                        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mint Price</p>
                                <p className="text-lg font-bold">{price} ETH</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Minted</p>
                                <p className="text-lg font-bold">{minted} / {totalSupply}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleOpenMintModal}
                            disabled={!isConnected}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded mt-4 transition-colors duration-300 disabled:opacity-50">
                            {!isConnected ? 'Connect Wallet to Mint' : `Mint - ${price} ETH`}
                        </button>

                        {!isConnected && (
                            <p className="text-center text-sm mt-2 text-gray-500 dark:text-gray-400">
                                Connect your wallet to mint this NFT
                            </p>
                        )}
                    </div>
                </div>
            </main>

            {/* Mint Confirmation Modal */}
            {showMintModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Mint Confirmation - {name}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Minting to: {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Supply: {minted} / {totalSupply} minted
                            </p>

                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Public sale
                            </p>

                            {/* Quantity Selection */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[1, 3, 6, 10].map((qty) => (
                                    <button
                                        key={qty}
                                        onClick={() => handleQuantitySelect(qty)}
                                        disabled={qty > maxPerWallet}
                                        className={`px-4 py-2 rounded-full ${mintQuantity === qty
                                            ? 'bg-black text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            } ${qty > maxPerWallet ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {qty}
                                    </button>
                                ))}

                                <div
                                    className={`px-4 py-2 rounded-full ${customQuantity ? 'bg-black text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                        }`}
                                >
                                    <span>Custom</span>
                                    <input
                                        type="number"
                                        value={customQuantity}
                                        onChange={handleCustomQuantityChange}
                                        placeholder=""
                                        min="1"
                                        max={maxPerWallet}
                                        className="ml-2 w-12 bg-transparent border-none focus:ring-0 p-0 text-center"
                                    />
                                </div>
                            </div>

                            {/* Price Information */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>{price} ETH × {mintQuantity} NFT</span>
                                    <span>{totals.subtotal} ETH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center">
                                        Platform fee <span className="text-xs ml-1">×</span> {mintQuantity}
                                    </span>
                                    <span>{totals.fee} ETH</span>
                                </div>
                                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span>Total</span>
                                    <span>{totals.total} ETH</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowMintModal(false)}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMint}
                                    disabled={isMinting}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded disabled:opacity-70"
                                >
                                    {isMinting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Minting...
                                        </div>
                                    ) : (
                                        `Mint - ${totals.total} ETH`
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 Stoopid Minting App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { ThemeToggle } from '@components/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';

export default function CreateMintPage() {
    const { address, isConnected } = useAccount();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        description: '',
        media: null as File | null,
        mediaPreview: '',
        network: 'Base',
        price: '0.01',
        editionType: 'fixed',
        editionSize: '1',
        startTime: 'Now',
        endTime: 'Forever',
        mintLimit: 'Unlimited',
        royalty: '5',
        payoutAddress: address || '',
        transferable: true,
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                media: file,
                mediaPreview: URL.createObjectURL(file)
            }));
        }
    };

    // Handle toggle changes
    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);

        router.push(`/create/success?name=${encodeURIComponent(formData.name)}` +
            `&symbol=${encodeURIComponent(formData.symbol)}` +
            `&description=${encodeURIComponent(formData.description)}` +
            `&price=${encodeURIComponent(formData.price)}` +
            `&supply=${encodeURIComponent(formData.editionType === 'fixed' ? formData.editionSize : 'Open')}` +
            `&imageUrl=${formData.mediaPreview ? encodeURIComponent(formData.mediaPreview) : '/placeholder-nft.jpg'}` +
            `&network=${encodeURIComponent(formData.network)}`
        );
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stoopid App</h1>
                        <div className="flex items-center space-x-4">
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

                <div className="container mx-auto py-16 px-4">
                    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect Wallet to Create</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            You need to connect your wallet to create NFT editions.
                        </p>
                        <ConnectWallet className="mx-auto" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stoopid App</h1>
                    <div className="flex items-center space-x-4">
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
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Create NFT Edition</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Edition Preview */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-fit">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden relative">
                            {formData.mediaPreview ? (
                                <div className="w-full h-full relative">
                                    <Image
                                        src={formData.mediaPreview}
                                        alt={formData.name || 'NFT Preview'}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500 dark:text-gray-400">Media Preview</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formData.name || 'Edition name'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="inline-flex items-center bg-black text-white px-3 py-1 rounded-full text-sm">
                                    {formData.symbol ? `$${formData.symbol}` : '$SYMBOL'}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    EDITION
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                {formData.description || 'Description'}
                            </p>

                            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">EDITION PRICE</p>
                                    <p className="text-lg font-bold">{formData.price} ETH</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">TOTAL SUPPLY</p>
                                    <p className="text-lg font-bold">
                                        {formData.editionType === 'fixed' ? formData.editionSize : '∞'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edition Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Symbol
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400">$</span>
                                    </div>
                                    <input
                                        type="text"
                                        id="symbol"
                                        name="symbol"
                                        value={formData.symbol}
                                        onChange={handleChange}
                                        placeholder="SYMBOL"
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide a description of your edition"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Media
                                </label>
                                <div
                                    className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/svg+xml,image/gif,image/webp,video/mp4,video/quicktime,video/mpeg,audio/mpeg,audio/mp4,audio/wav"
                                    />
                                    <div className="space-y-2">
                                        <div className="flex justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        {formData.media ? (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formData.media.name}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    JPG, PNG, SVG, GIF, WEBP, MP4, Quicktime, MPEG, MP3, M4A, WAV
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="network" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Network
                                </label>
                                <select
                                    id="network"
                                    name="network"
                                    value={formData.network}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    disabled
                                >
                                    <option value="Base">Base</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        step="0.001"
                                        min="0"
                                        className="w-full pr-16 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400">ETH</span>
                                    </div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Collectors pay an additional 0.0001 ETH fee mint fee to Stoopid App.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Edition size
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <select
                                            id="editionType"
                                            name="editionType"
                                            value={formData.editionType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="fixed">Fixed</option>
                                            <option value="open">Open Edition</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            id="editionSize"
                                            name="editionSize"
                                            value={formData.editionSize}
                                            onChange={handleChange}
                                            min="1"
                                            placeholder="Editions"
                                            disabled={formData.editionType === 'open'}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start & end time <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            id="startTime"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            placeholder="Now"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            id="endTime"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            placeholder="Forever"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="mintLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mint limit per address
                                </label>
                                <input
                                    type="text"
                                    id="mintLimit"
                                    name="mintLimit"
                                    value={formData.mintLimit}
                                    onChange={handleChange}
                                    placeholder="Unlimited"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Optionally set a limit of how many NFTs a single address can mint.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="royalty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Royalty
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="royalty"
                                        name="royalty"
                                        value={formData.royalty}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400">%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="payoutAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Payout address
                                </label>
                                <input
                                    type="text"
                                    id="payoutAddress"
                                    name="payoutAddress"
                                    value={formData.payoutAddress}
                                    onChange={handleChange}
                                    placeholder="0x..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    The address that will receive any withdrawals and royalties. It can be your personal wallet, a multisignature wallet, or an external splits contract.
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="transferable" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        NFT Transferable
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="transferable"
                                            name="transferable"
                                            checked={formData.transferable}
                                            onChange={handleToggleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                                    Turning &quot;OFF&quot; will create a Soulbound NFT edition which means that NFT can never be transferred or sold to another wallet. Suggested use cases: badges, achievements or memberships.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded transition-colors duration-300 mt-8"
                            >
                                Create
                            </button>

                            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                                Stoopid App is free for creators <a href="#" className="text-blue-600 hover:underline">Learn more</a>
                            </p>
                        </form>
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
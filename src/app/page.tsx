'use client';

import { ConnectWallet } from '@components/ConnectWallet';
import { MintCard } from '@components/MintCard';
import { ThemeToggle } from '@components/ThemeToggle';
import Link from 'next/link';

// This is a placeholder. Replace with your actual deployed contract address
const NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function MintPage() {
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
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Mint Your Himeko
              </h2>
              <MintCard contractAddress={NFT_CONTRACT_ADDRESS} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                About This Collection
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                This exclusive NFT collection features unique digital artwork on the Base network.
                Each NFT is one-of-a-kind and grants you special access to our community.
              </p>
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
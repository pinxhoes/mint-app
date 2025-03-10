import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

export function getConfig() {
    const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia;

    return createConfig({
        chains: [chain],
        connectors: [
            coinbaseWallet({
                appName: 'NFT Minting App',
            }),
            injected(), // For MetaMask and other injected wallets
        ],
        ssr: true, //server side rendering
        transports: {
            [base.id]: http(),
            [baseSepolia.id]: http(),
        },
    });
}
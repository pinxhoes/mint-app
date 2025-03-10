'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { base, baseSepolia } from 'wagmi/chains';

export function Providers(props: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <OnchainKitProvider
                apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                chain={process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia}
            >
                {props.children}
            </OnchainKitProvider>
        </ThemeProvider>
    );
}
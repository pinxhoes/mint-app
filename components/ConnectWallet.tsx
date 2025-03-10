'use client';

import { Avatar, Name } from '@coinbase/onchainkit/identity';
import {
    ConnectWallet as OnchainConnectWallet,
    Wallet
} from '@coinbase/onchainkit/wallet';

interface ConnectWalletProps {
    className?: string;
}

export function ConnectWallet({ className }: ConnectWalletProps) {
    return (
        <div className={`bg-card text-card-foreground border border-border p-4 rounded-lg ${className}`}>
            <Wallet>
                <OnchainConnectWallet className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition">
                    <Avatar className="h-6 w-6 border border-ring" />
                    <Name className="text-foreground font-medium" />
                </OnchainConnectWallet>
            </Wallet>
        </div>
    );
}
import '@coinbase/onchainkit/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { type ReactNode } from 'react';
import './globals.css';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stoopid App',
  description: 'Mint your NFTs on Base Network',
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} theme-custom text-foreground`}>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
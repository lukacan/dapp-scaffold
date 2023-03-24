import { FC } from 'react';
import Link from "next/link";
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NavElement from './nav-element';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-15 flex-row md:mb-2 shadow-lg bg-black text-neutral-content border-b border-emerald-400 bg-opacity-66">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
          <NavElement
            label="Home"
            href="/"
            navigationStarts={() => setIsNavOpen(false)}
          />
            <NavElement
              label="List parties"
              href="/vote"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Create Party"
              href="/addparty"
              navigationStarts={() => setIsNavOpen(false)}
            />

            <NavElement
              label="Add Voter"
              href="/addvoter"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Voter stats"
              href="/listvoter"
              navigationStarts={() => setIsNavOpen(false)}
            />
            <NavElement
              label="Socials"
              href="/socials"
              navigationStarts={() => setIsNavOpen(false)}
            />
          </div>
          <div className='flex ml-auto'>
          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6" />

          </div>
      </div>
    </div>
  );
};

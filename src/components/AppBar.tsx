import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from "react";
import { useAutoConnect } from '../contexts/AutoConnectProvider';
import NavElement from './nav-element';

import Image from 'next/image';


const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }


);

export const AppBar: React.FC = () => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const [isDropdownOpenParty, setIsDropdownOpenParty] = useState(false);
  const [isDropdownOpenVoter, setIsDropdownOpenVoter] = useState(false);
  const [isDropdownOpenSocials, setIsDropdownOpenSocials] = useState(false);



  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRefParty = useRef(null);
  const dropdownRefVoter = useRef(null);
  const dropdownRefSocials = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRefParty?.current?.contains(event.target)) {
        setIsDropdownOpenParty(false);
      }
      if (!dropdownRefVoter?.current?.contains(event.target)) {
        setIsDropdownOpenVoter(false);
      }
      if (!dropdownRefSocials?.current?.contains(event.target)) {
        setIsDropdownOpenSocials(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [dropdownRefParty, dropdownRefVoter, dropdownRefSocials]);

  return (
    <div>
      {/* NavBar / Header */}
      <div className="navbar flex h-15 shadow-lg bg-black border-b border-emerald-400">
        <div className="hidden md:inline-flex align-items-center justify-items gap-6">
          <Image
            src="/logo1.png"
            alt="janecek voting astronaut"
            width={50}
            height={50}
          />
          <NavElement
            label="Home"
            href="/"
            navigationStarts={() => setIsNavOpen(false)}
          />

          <section ref={dropdownRefParty}>
            <div className="relative inline-block text-left">
              <button
                className="btn-dropdown text-lg font-medium sm:text-xl"
                onClick={() => setIsDropdownOpenParty(!isDropdownOpenParty)}
              >
                Party
              </button>
              {isDropdownOpenParty && (
                <div className="absolute right-0 w-40 mt-2 bg-black rounded-md shadow-lg z-10">
                  <NavElement
                    label="List Parties"
                    href="/vote"
                    navigationStarts={() => setIsDropdownOpenParty(false)}
                  />
                  <NavElement
                    label="Create Party"
                    href="/addparty"
                    navigationStarts={() => setIsDropdownOpenParty(false)}
                  />
                  <NavElement
                    label="My Parties"
                    href="/myparties"
                    navigationStarts={() => setIsDropdownOpenParty(false)}
                  />
                </div>
              )}
            </div>
          </section>
          <section ref={dropdownRefVoter}>
            <div className="relative inline-block text-left">
              <button
                className="btn-dropdown text-lg font-medium sm:text-xl"
                onClick={() => setIsDropdownOpenVoter(!isDropdownOpenVoter)}
              >
                Voter
              </button>
              {isDropdownOpenVoter && (
                <div className="absolute right-0 w-40 mt-2 bg-black rounded-md shadow-lg z-10">
                  <NavElement
                    label="Add Voter"
                    href="/addvoter"
                    navigationStarts={() => setIsDropdownOpenVoter(false)}
                  />
                  <NavElement
                    label="Voter Stats"
                    href="/listvoter"
                    navigationStarts={() => setIsDropdownOpenVoter(false)}
                  />
                </div>
              )}
            </div>
          </section>
          <section ref={dropdownRefSocials}>
            <div className="relative inline-block text-left">
              <button
                className="btn-dropdown text-lg font-medium sm:text-xl"
                onClick={() => setIsDropdownOpenSocials(!isDropdownOpenSocials)}
              >
                Socials
              </button>
              {isDropdownOpenSocials && (
                <div className="absolute right-0 w-40 mt-2 bg-black rounded-md shadow-lg z-10">
                  <NavElement
                    label="Tweet"
                    href="/createtweet"
                    navigationStarts={() => setIsDropdownOpenSocials(false)}
                  />
                  <NavElement
                    label="List Tweets"
                    href="/listtweets"
                    navigationStarts={() => setIsDropdownOpenSocials(false)}
                  />
                  <NavElement
                    label="My Tweets"
                    href="/mytweets"
                    navigationStarts={() => setIsDropdownOpenSocials(false)}
                  />
                </div>
              )}
            </div>
          </section>
          {/* <NavElement
            label="List Parties"
            href="/vote"
            navigationStarts={() => setIsNavOpen(false)}
          />
          <NavElement
            label="Create Party"
            href="/addparty"
            navigationStarts={() => setIsNavOpen(false)}
          /> */}

          {/* <NavElement
            label="Add Voter"
            href="/addvoter"
            navigationStarts={() => setIsNavOpen(false)}
          />
          <NavElement
            label="Voter Stats"
            href="/listvoter"
            navigationStarts={() => setIsNavOpen(false)}
          /> */}
          {/* <NavElement
            label="Tweet"
            href="/createtweet"
            navigationStarts={() => setIsNavOpen(false)}
          />
          <NavElement
            label="List Tweets"
            href="/listtweets"
            navigationStarts={() => setIsNavOpen(false)}
          />
          <NavElement
            label="My Tweets"
            href="/mytweets"
            navigationStarts={() => setIsNavOpen(false)}
          /> */}
        </div>
        <div className='flex ml-auto'>
          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn text-lg mr-6" />

        </div>
      </div>
    </div>
  );
};

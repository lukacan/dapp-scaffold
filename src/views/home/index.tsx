// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance)
  const { getUserSOLBalance } = useUserSOLBalanceStore()

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58())
      getUserSOLBalance(wallet.publicKey, connection)
    }
  }, [wallet.publicKey, connection, getUserSOLBalance])

  return (

    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className='mt-7'>
          <div className='font-normal align-top text-right text-slate-600 mt-5'></div>
          <h1 className="text-center text-6xl md:pl-13 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-10">
            Janecek Method
          </h1>
        </div>
        <h4 className="text-1x1 md:text-1xl text-center text-slate-300 my-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-50 animate-tilt"></div>
            <div className="max-w-md mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Everyone can register a subject (e.g. political party)`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Everyone can list registered subjects`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Everyone can see subject’s results`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Everyone can add yourself as eligible voter`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Every voter has 2 positive and 1 negative vote`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Both positive votes can’t be given to the same subject`} </code>
              </pre>
              <pre data-prefix=">">
                <code className="truncate" style={{ fontSize: '10px' }}>{`Negative vote can be used only after 2 positive votes`} </code>
              </pre>
            </div>
          </div>
        </h4>
      </div>
    </div>
  );
};

// TODO: SignMessage
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';

import { Program, AnchorProvider, web3, utils, BN } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey } from '@solana/web3.js';
import { type } from 'os';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)


export const CreateTweet: FC = () => {
  const ourWallet = useWallet();
  const { connection } = useConnection();
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [result, setTweetResult] = useState('');



  const getProvider = () => {
    const provider = new AnchorProvider(connection,
      ourWallet,
      AnchorProvider.defaultOptions())
    return provider
  }

  const sendTweet = async () => {
    try {
      const provider = getProvider()
      const program = new Program(idl_object, programID, provider)


      const bn_time = new BN(Date.now())

      const [tweet_pda] = await PublicKey.findProgramAddressSync([
        provider.wallet.publicKey.toBytes(),
        utils.bytes.utf8.encode(bn_time.toString())
      ], program.programId)


      await program.rpc.createTweet(bn_time.toString(), topic, content, {
        accounts: {
          author: provider.wallet.publicKey,
          tweet: tweet_pda,
          systemProgram: web3.SystemProgram.programId,
        }

      })
      setTweetResult("Tweet posted successfully")

    } catch (error) {
      console.error(error)
      setTweetResult("Something went wrong")
    }

    setTimeout(() => {
      setTweetResult('');
    }, 2000);


  }


  const intToDate = (party) => {
    const date = new Date(party.created.toNumber() * 1000)
    return date
  }


  return (
    <>
      <div className="relative group items-center">
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
        <div className="mx-auto mockup-code bg-primary p-6 px-4 my-4 text-left" style={{ width: '350px', height: '350px' }}>
          <input
            type="text"
            className="w-full bg-transparent border-2 border-emerald-400 text-lg pb-2 mb-4 text-white"
            placeholder="Enter topic here"
            maxLength={32}
            onChange={(e) => setTopic(e.target.value)}
          />
          <textarea className="w-full h-full message block resize-none bg-transparent border-gray-300 focus:border-indigo-500 text-lg pb-2 mb-4"
            placeholder="Enter tweet here"
            maxLength={500}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>


      <div className="flex flex-row justify-center">
        <div className="relative group">
          <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
            onClick={sendTweet} disabled={!ourWallet.publicKey || (!topic || !content)}

          >
            {!result && !ourWallet.publicKey && (
              <pre data-prefix=">">
                <code className="truncate">{"Wallet not connected"} </code>
              </pre>
            )}
            {!result && ourWallet.publicKey && (!topic || !content) && (
              <pre data-prefix=">">
                <code className="truncate">{"Fill both inputs"} </code>
              </pre>
            )}
            {!result && ourWallet.publicKey && topic && content && (
              <pre data-prefix=">">
                <code className="truncate">{"Send Tweet"} </code>
              </pre>
            )}
            {result && (
              <pre data-prefix=">">
                <code className="truncate">{`${result}`} </code>
              </pre>
            )}
          </button>
        </div>
      </div>
    </>

  );
};

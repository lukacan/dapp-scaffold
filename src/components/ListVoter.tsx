import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';
import * as assert from "assert";

import { Program, AnchorProvider, web3, utils, AnchorError, TransactionFn } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey, Keypair, Transaction } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)



export const ListVoter: FC = () => {


    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [voterNotFound, setVoterFound] = useState(false);
    const [voterStats, setVoterStats] = useState(idl_object.accounts.voter);



    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const listStats = async () => {
        try {

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)


            const [voter, bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)

            const accountInfo = await program.account.voter.fetch(voter)
            console.log(accountInfo)
            if (accountInfo == null) {
                setVoterFound(true)
            }
            else {
                setVoterStats(accountInfo)
            }
        } catch (error) {
            setVoterFound(true)
            console.log(error)
        }
        setTimeout(() => {
            setVoterFound(false);
        }, 2000);

    }

    return (
        <>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                <div className="mx-auto mockup-code bg-primary border-3 border-[#5252529f] p-6 px-4 my-4 text-left">
                    {!voterStats && (
                        <div className="typing-animation">
                            <h1>
                                <pre data-prefix=">">
                                    <code className="truncate">{"Connect your wallet and check your voter stats"} </code>
                                </pre>
                            </h1>
                            <h1>
                                <pre data-prefix=">">
                                    <code className="truncate">{"Free votes: ..."} </code>
                                </pre>
                            </h1>
                            <h1>
                                <pre data-prefix=">">
                                    <code className="truncate">{"..."} </code>
                                </pre>
                            </h1>
                        </div>
                    )}
                    {voterStats && (
                        <>
                            <div className="typing-animation">
                                <h1>
                                    <pre data-prefix=">">
                                        <code className="truncate">{"Can vote: " + `${voterStats.canVote}`} </code>
                                    </pre>
                                </h1>
                                <h1>
                                    <pre data-prefix=">">
                                        <code className="truncate">{"First positive vote: " + `${voterStats.pos1}`} </code>
                                    </pre>
                                </h1>
                                <h1>
                                    <pre data-prefix=">">
                                        <code className="truncate">{"Second positive vote: " + `${voterStats.pos2}`} </code>
                                    </pre>
                                </h1>
                                <h1>
                                    <pre data-prefix=">">
                                        <code className="truncate">{"Negative vote: " + `${voterStats.neg}`} </code>
                                    </pre>
                                </h1>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
                        onClick={listStats} disabled={!ourWallet.publicKey}
                    >
                        {!voterNotFound && !ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Wallet not connected"} </code>
                            </pre>
                        )}
                        {!voterNotFound && ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"List voter stats"} </code>
                            </pre>
                        )}
                        {voterNotFound && (
                            <pre data-prefix=">">
                                <code className="truncate">{"No voter"} </code>
                            </pre>
                        )}

                    </button>
                </div>
            </div>
        </>

    );
};

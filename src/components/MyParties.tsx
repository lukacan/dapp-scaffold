// TODO: SignMessage
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useState } from 'react';
import { sha256 } from "js-sha256"

import { Program, AnchorProvider, web3 } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)

export const MyParties: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [parties, setParties] = useState([])
    const [result, setResult] = useState("")
    const [result_, setResult_] = useState("")


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const listMyParties = async () => {
        try {
            console.log("Listing all Parties")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            const discriminator = Buffer.from(sha256.digest("account:Party")).subarray(0, 8)


            Promise.all((await connection.getProgramAccounts(programID,
                {
                    filters: [{
                        memcmp: {
                            offset: 0,
                            bytes: bs58.encode(discriminator)
                        },
                    }, {
                        memcmp: {
                            offset: 8,
                            bytes: provider.wallet.publicKey.toBase58()
                        },
                    }
                    ],
                })).map(async party => ({
                    ...(await program.account.party.fetch(party.pubkey)),
                    pubkey: party.pubkey
                }))).then(parties => {
                    setParties(parties)
                })
        } catch (error) {
            console.error(error)
        }
    }

    const deleteMyParty = async (party_address, party_name) => {
        try {
            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            await program.rpc.deleteParty(party_name, {
                accounts: {
                    author: provider.wallet.publicKey,
                    party: party_address,
                    systemProgram: web3.SystemProgram.programId,
                }

            })
            setResult("Party deleted")
        } catch (error) {
            console.error(error)
            setResult("Something went wrong")
        }
        setTimeout(() => {
            setResult('');
        }, 2000);
    }
    const startVoting = async (party_address, party_name) => {
        try {
            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            await program.rpc.startVoting(party_name, {
                accounts: {
                    author: provider.wallet.publicKey,
                    party: party_address,
                    systemProgram: web3.SystemProgram.programId,
                }

            })
            setResult_("Voting started")
        } catch (error) {
            console.error(error)
            setResult_("Something went wrong")
        }
        setTimeout(() => {
            setResult_('');
        }, 2000);
    }

    const intToDate = (number) => {
        const date = new Date(number * 1000)
        return date
    }


    return (
        <>
            <h4 className="text-1x1 md:text-1xl text-center text-slate-300 my-2">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                    <div className="mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
                        <div className="typing-animation">
                            <h1>
                                <pre data-prefix=">">
                                    <code className="truncate">{"List all My Parties ..."} </code>
                                </pre>
                                <pre data-prefix=">">
                                    <code className="truncate">{"Then, you can delete them ..."} </code>
                                </pre>
                            </h1>
                        </div>
                    </div>
                </div>
            </h4>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
                        onClick={listMyParties} disabled={!ourWallet.publicKey}
                    >
                        {!ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Connect your wallet"} </code>
                            </pre>
                        )}
                        {ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"List all your Parties"} </code>
                            </pre>
                        )}
                    </button>
                </div>
            </div>
            {parties.map((party) => {
                return (
                    <div className='md:hero-content flex flex-col'>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                            <div className="mx-auto mockup-code bg-primary p-6 px-4 my-4 text-left">
                                <div className="typing-animation">
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Name: " + party.name.toString()} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Votes: " + party.votes.toString()} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Created: " + intToDate(party.created.toNumber())} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Voting started: " + party.votingStarted} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Voting ends: " + intToDate(party.votingEnds.toNumber())} </code>
                                        </pre>
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row justify-center">
                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-red-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-red-600 text-black"
                                    onClick={() => deleteMyParty(party.pubkey.toString(), party.name.toString())} disabled={!ourWallet.publicKey}
                                >
                                    {!ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>
                                    )}
                                    {!result && ourWallet.publicKey && (
                                        <code className="truncate">{"Delete Party"} </code>
                                    )}
                                    {result && (
                                        <code className="truncate">{`${result}`} </code>
                                    )}

                                </button>
                            </div>
                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-lime-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-lime-600 text-black"
                                    onClick={() => startVoting(party.pubkey.toString(), party.name.toString())} disabled={!ourWallet.publicKey}
                                >
                                    {!ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>
                                    )}
                                    {!result_ && ourWallet.publicKey && (
                                        <code className="truncate">{"Start Voting"} </code>
                                    )}
                                    {result_ && (
                                        <code className="truncate">{`${result_}`} </code>
                                    )}

                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>

    );
};

// TODO: SignMessage
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useState } from 'react';
import { sha256 } from "js-sha256"

import { Program, AnchorProvider, web3, utils, AnchorError, BN } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)

export const Vote: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [partyName, setPartyName] = useState('');
    const [parties, setParties] = useState([])
    const [voted_p, setVotedP] = useState('')
    const [voted_n, setVotedN] = useState('')


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }


    const listParties = async () => {
        try {
            console.log("Listing all Parties")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            // check 8 byte discriminator
            const discriminator = Buffer.from(sha256.digest("account:Party")).subarray(0, 8)
            Promise.all((await connection.getProgramAccounts(programID,
                {
                    filters: [{
                        memcmp: {
                            offset: 0,
                            bytes: bs58.encode(discriminator)
                        }
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

    const listParty = async () => {
        try {
            console.log("Listing party by name")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)


            const [party, _] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode(partyName),
            ], program.programId)

            const accountInfo = await connection.getAccountInfo(party)
            if (accountInfo == null) {
                console.log("Party does not exist.")
                setParties([])
            }
            else {
                const fetched_party = await program.account.party.fetch(party)
                setParties([fetched_party])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const votePositive = async (name) => {
        console.log("Voting Positive")
        const provider = getProvider()
        const program = new Program(idl_object, programID, provider)

        const [party] = await PublicKey.findProgramAddressSync([
            utils.bytes.utf8.encode(name),
        ], program.programId)

        try {
            const [voter] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)


            await program.rpc.votePositive(name, {
                accounts: {
                    voter: voter,
                    author: provider.wallet.publicKey,
                    party: party,
                    systemProgram: web3.SystemProgram.programId,
                }
            })

            setVotedP("Voted")
        } catch (error) {
            if (error instanceof AnchorError) {
                setVotedP((error as AnchorError)
                    .error.errorMessage)
            }
            else {
                console.log(error)
                setVotedP("Error")
            }
        }

        setTimeout(() => {
            setVotedP('');
        }, 2000);
    }

    const voteNegative = async (name) => {

        console.log("Voting Negative")

        const provider = getProvider()
        const program = new Program(idl_object, programID, provider)

        const [party, bump] = await PublicKey.findProgramAddressSync([
            utils.bytes.utf8.encode(name),
        ], program.programId)

        try {
            const [voter] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)


            await program.rpc.voteNegative(name, {
                accounts: {
                    voter: voter,
                    author: provider.wallet.publicKey,
                    party: party,
                    systemProgram: web3.SystemProgram.programId,
                }
            })

            setVotedN("Voted")
        } catch (error) {
            if (error instanceof AnchorError) {
                setVotedN((error as AnchorError)
                    .error.errorMessage)
            }
            else {
                console.log(error)
                setVotedN("Error")
            }
        }

        setTimeout(() => {
            setVotedN('');
        }, 2000);
    }

    const intToDate = (number) => {
        if (number == 0){
            return "Voting not started yet"
        }else
        {
            const date = new Date(number * 1000)
            return date
        }
    }


    return (
        <><h4 className="text-1x1 md:text-1xl text-center text-slate-300 my-2">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                <div className="mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
                    <div className="typing-animation">
                        <h1>
                            <pre data-prefix=">">
                                <code className="truncate">{"List all registered parties or find party by name"} </code>
                            </pre>
                            <pre data-prefix=">">
                                <code className="truncate">{"Then, you can apply your votes"} </code>
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
                        onClick={listParties}
                    >
                        <code className="truncate">{"List all parties"} </code>
                    </button>
                </div>
                <input
                    type="text"
                    className="w-60 m-2 p-1 border-2 border-gray-300 rounded-lg text-black"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                />
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
                        onClick={listParty} disabled={!partyName}
                    >
                        {partyName ? (<code className="truncate">{"Find party"} </code>) :
                            (<code className="truncate">{"Enter party name"} </code>)
                        }
                    </button>
                </div>
            </div>
            {parties.map((party) => {
                return (
                    <div className='md:hero-content flex flex-col'>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                            <div className="mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
                                <div className="typing-animation">
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Name: " + party.name.toString()} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Owner: " + party.author.toString()} </code>
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
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-lime-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-lime-600 text-black"
                                    onClick={() => votePositive(party.name.toString())} disabled={!ourWallet.publicKey}
                                    name={party.pubkey.toString()}>
                                    {!voted_p && !ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>

                                    )}
                                    {!voted_p && ourWallet.publicKey && (
                                        <code className="truncate">{"Vote Positive"} </code>
                                    )}
                                    {voted_p && (
                                        <code className="truncate">{`${voted_p}`} </code>
                                    )}
                                </button>
                            </div>
                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-red-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-red-600 text-black"
                                    onClick={() => voteNegative(party.name.toString())} disabled={!ourWallet.publicKey}>
                                    {!voted_n && !ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>
                                    )}
                                    {!voted_n && ourWallet.publicKey && (
                                        <code className="truncate">{"Vote Negative"} </code>
                                    )}
                                    {voted_n && (
                                        <code className="truncate">{`${voted_n}`} </code>
                                    )}
                                </button>
                            </div>
                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-lime-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
                                >
                                    {!ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>

                                    )}
                                    {ourWallet.publicKey && (
                                        <code className="truncate">{"Donate (TO DO)"} </code>
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

// TODO: SignMessage
import { verify } from '@noble/ed25519';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import * as assert from "assert";

import { Program, AnchorProvider, web3, utils, AnchorError } from "@project-serum/anchor"
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

            Promise.all((await connection.getProgramAccounts(programID,
                {
                    filters: [
                        {
                            dataSize: 189,
                        },
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


            const [party, bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode(partyName),
            ], program.programId)

            const accountInfo = await connection.getAccountInfo(party)
            if (accountInfo == null)
            {
                console.log("Party does not exist.")
                setParties([])
            }
            else{
                const fetched_party = await program.account.party.fetch(party)
                setParties([fetched_party])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const votePositive = async (publicKey) => {
        console.log("Voting Positive")

        const provider = getProvider()
        const program = new Program(idl_object, programID, provider)

        try {
            const [voter, bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)


            await program.rpc.votePositive({
                accounts: {
                    voter: voter,
                    author:provider.wallet.publicKey,
                    party: publicKey,
                    systemProgram: web3.SystemProgram.programId,
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const voteNegative = async (publicKey) => {
        console.log("Voting Negative")

        const provider = getProvider()
        const program = new Program(idl_object, programID, provider)

        try {
            const [voter, bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)


            await program.rpc.voteNegative({
                accounts: {
                    voter: voter,
                    author:provider.wallet.publicKey,
                    party: publicKey,
                    systemProgram: web3.SystemProgram.programId,
                }
            })
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <>
            {parties.map((party) => {
                return (
                    <div className='md:hero-content flex flex-col'>
                        <h1>{"Party name: " + party.name.toString()}</h1>
                        <span>{"Party owner: " + party.author.toString()}</span>
                        <span>{"Votes: " + party.votes.toString()}</span>
                        <div className="flex flex-row justify-center">
                            <button
                                className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                                onClick={() => votePositive(party.pubkey)} disabled={!ourWallet.publicKey}
                            >
                                {!ourWallet.publicKey && (
                                    <div className="block w-60 m-2 text-black">Wallet not connected</div>
                                )}
                                {ourWallet.publicKey && (
                                    <div className="block w-60 m-2 text-black">Vote Positive</div>
                                )}
                            </button>
                            <button
                                className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                                onClick={() => voteNegative(party.pubkey)} disabled={!ourWallet.publicKey}
                            >
                                {!ourWallet.publicKey && (
                                    <div className="block w-60 m-2 text-black">Wallet not connected</div>
                                )}
                                {ourWallet.publicKey && (
                                    <div className="block w-60 m-2 text-black">Vote Negative</div>
                                )}
                            </button>
                        </div>

                    </div>
                )
            })}
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={listParties}
                    >
                        <span className="block group-disabled:hidden" >
                            List all parties
                        </span>
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-center">
                <input
                    type="text"
                    className="w-60 m-2 p-1 border-2 border-gray-300 rounded-lg text-black"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                />
            </div>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={listParty} disabled={!partyName}
                    >
                        {!partyName && (
                            <div className="block w-60 m-2 text-black">Enter party name</div>
                        )}
                        {partyName && (
                            <div className="block w-60 m-2 text-black">Find party</div>
                        )}
                    </button>
                </div>
            </div>
        </>

    );
};

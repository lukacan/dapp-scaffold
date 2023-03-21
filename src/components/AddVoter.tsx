import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';
import * as assert from "assert";

import { Program, AnchorProvider, web3, utils, AnchorError, TransactionFn } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey, Keypair, Transaction } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)



export const AddVoter: FC = () => {


    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [createdVoter, setCreatedVoter] = useState('');


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const addVoter = async () => {
        try {
            console.log("Adding Voter")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            const [voter, bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode("new_voter"),
                provider.wallet.publicKey.toBytes()
            ], program.programId)

            const accountInfo = await connection.getAccountInfo(voter)

            if (accountInfo != null) {
                setCreatedVoter("Voter already in use")
            }
            else {
                await program.rpc.createVoter({
                    accounts: {
                        author: provider.wallet.publicKey,
                        voter: voter,
                        systemProgram: web3.SystemProgram.programId,
                    }
                })

                setCreatedVoter("Ready to vote")
            }
        } catch (error) {
            console.log(error)
        }


        setTimeout(() => {
            setCreatedVoter('');
        }, 2000);

    }

    return (
        <>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500 rounded-lg blur opacity-50 animate-tilt"></div>
                <div className="mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
                    <pre data-prefix=">">
                        <code className="truncate">{"Connect your wallet and register as voter."} </code>
                    </pre>
                </div>
            </div>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={addVoter} disabled={!ourWallet.publicKey}
                    >
                        {!createdVoter && !ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Wallet not connected"} </code>
                            </pre>
                        )}
                        {!createdVoter && ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Add Voter"} </code>
                            </pre>
                        )}
                        {createdVoter && (
                            <pre data-prefix=">">
                                <code className="truncate">{`${createdVoter}`} </code>
                            </pre>
                        )}

                    </button>
                </div>
            </div>
        </>

    );
};

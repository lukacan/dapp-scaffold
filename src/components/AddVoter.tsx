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
                setCreatedVoter("Voter already in use !!!")
            }
            else {
                await program.rpc.createVoter({
                    accounts: {
                        author: provider.wallet.publicKey,
                        voter: voter,
                        systemProgram: web3.SystemProgram.programId,
                    }
                })

                setCreatedVoter("You are now ready to vote !!! :) .")
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
            <h3 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
                <p className='text-slate-500 text-2x1 leading-relaxed'>Connect your wallet and register as voter.</p>
            </h3>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={addVoter} disabled={!ourWallet.publicKey}
                    >
                        {!ourWallet.publicKey && (
                            <div className="block w-60 m-2 text-black">Wallet not connected</div>
                        )}
                        <span className="block group-disabled:hidden" >
                            Add Voter
                        </span>
                    </button>
                </div>
            </div>
            {createdVoter && (
                <div className="mt-2 text-white-500 animate-fade-out">{`${createdVoter}`}</div>
            )}
        </>

    );
};

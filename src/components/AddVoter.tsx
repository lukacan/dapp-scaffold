import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';
import * as assert from "assert";

import { Program, AnchorProvider, web3, utils, AnchorError, TransactionFn } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey, Keypair, Transaction  } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)

const admin = new PublicKey("G6ScTg7oSQPoKv6WtikLJeFgnE85TJBCPFAaiha7qbzJ")



export const AddVoter: FC = () => {
    let admin_secretKey = Uint8Array.from([206,146,51,36,247,155,237,189,223,
        244,222,196,51,107,85,193,76,22,132,33,97,251,158,85,93,55,197,87,
        122,101,145,176,224,68,42,180,144,146,5,12,50,29,187,121,160,8,189,
        245,198,249,155,243,106,173,77,196,113,211,235,27,128,134,150,195]);
    
    let admin_keypair = Keypair.fromSecretKey(admin_secretKey);


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

            const accounts = await connection.getProgramAccounts(programID,
                {
                    filters: [
                        {
                            dataSize: 200,
                        },
                        {
                            memcmp: {
                                offset: 8,
                                bytes: provider.wallet.publicKey.toString()
                            }
                        }
                    ],
                })

            console.log(provider.wallet.publicKey.toString())
            if (accounts.length != 0) {
                setCreatedVoter("This wallet is already registered as voter.")
            }
            else {
                const transaction = program.transaction.createVoter({
                    accounts:{
                        admin: admin_keypair.publicKey,
                        voter: provider.wallet.publicKey,
                        systemProgram: web3.SystemProgram.programId
                    }
                }).sign();
                // const transaction = new TransactionF().add(
                    
                //     provider.connection.tr
                    
                //     program.methods.createVoter().accounts({
                //         admin: admin_keypair.publicKey,
                //         voter: provider.wallet.publicKey,
                //         systemProgram: web3.SystemProgram.programId
                //     })
                // ) 

                setCreatedVoter("You are now ready to vote !!! :) .")
            }


        } catch (error) {

            console.error(error)
        }


        setTimeout(() => {
            setCreatedVoter('');
        }, 2000);

    }

    return (
        <>
            <div className="flex flex-row justify-center">
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={addVoter} disabled={!ourWallet.publicKey}
                    >
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

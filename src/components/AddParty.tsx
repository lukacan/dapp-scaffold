import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState  } from 'react';
import * as assert from "assert";

import {Program, AnchorProvider, web3, utils, AnchorError} from "@project-serum/anchor"
import idl from "./janecek_method.json"
import {PublicKey } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)

export const CreateParty: FC = () => {
    const ourWallet = useWallet();
    const {connection} = useConnection();
    const [partyName, setPartyName] = useState('');
    const [createdParty, setCreatedParty] = useState('');


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
                                            ourWallet,
                                            AnchorProvider.defaultOptions())
        return provider
    }

    const createParty = async () =>{
        try {
            console.log("Creating party")
            
            const provider = getProvider()
            const program = new Program(idl_object,programID,provider)


            const [party,bump] = await PublicKey.findProgramAddressSync([
                utils.bytes.utf8.encode(partyName),
            ],program.programId)

            const info = await program.provider.connection.getAccountInfo(party);

            if(info != null)
            {
                setCreatedParty("Party with this name already exists.");
            }
            else
            {
                await program.rpc.createParty(partyName,{
                    accounts:{
                        author: provider.wallet.publicKey,
                        party: party,
                        systemProgram: web3.SystemProgram.programId,
                    }
                })
    
                //console.log("New party created: " + party.toString())
                setCreatedParty("New party created: " + partyName + ".");
            }




        } catch (error) {
            // //assert.ok(error instanceof AnchorError);
            // if ((error as AnchorError).error.errorCode.code == "NameTooLong")
            // {
            //     setCreatedParty((error as AnchorError).error.errorMessage);
            // }
            console.error("Error while creating party: " + error)

        }

        setTimeout(() => {
            setCreatedParty('');
          }, 2000);
    }

    return (
        <>

            <div className="flex flex-row justify-center">
                <input
                    type="text"
                    className="w-60 m-2 p-1 border-2 border-gray-300 rounded-lg text-black"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                />
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={createParty} disabled={!ourWallet.publicKey || !partyName}
                    >
                    {!ourWallet.publicKey && (
                        <div className="block w-60 m-2 text-black">Wallet not connected</div>
                    )}
                    {ourWallet.publicKey && !partyName && (
                        <div className="block w-60 m-2 text-black">Please enter party name</div>
                    )}
                    {ourWallet.publicKey && partyName && (
                        <div className="block w-60 m-2 text-black">Create Party</div>
                    )}
                    </button>
                </div>
            </div>
            {createdParty && (
                <div className="mt-2 text-white-500 animate-fade-out">{`${createdParty}`}</div>
            )}
        </>

    );
};

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useState } from 'react';

import { Program, AnchorProvider, web3, utils, AnchorError } from "@project-serum/anchor"
import idl from "./janecek_method.json"
import { PublicKey } from '@solana/web3.js';


const idl_string = JSON.stringify(idl)
const idl_object = JSON.parse(idl_string)
const programID = new PublicKey(idl_object.metadata.address)

export const CreateParty: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [partyName, setPartyName] = useState('');
    const [createdParty, setCreatedParty] = useState('');


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const createParty = async () => {
        if (partyName.length > 32) {
            setCreatedParty("Name too long");
        }
        else {
            try {
                console.log("Creating party")

                const provider = getProvider()
                const program = new Program(idl_object, programID, provider)


                const [party, bump] = await PublicKey.findProgramAddressSync([
                    utils.bytes.utf8.encode(partyName),
                ], program.programId)


                /*
                    GetAccountInfo will fetch account based on publicKey, it is not problem here
                    because pda create uniquq address for parties based on their names. 
                */
                const info = await program.provider.connection.getAccountInfo(party);

                if (info != null) {
                    setCreatedParty("Name already exists");
                }
                else {
                    await program.rpc.createParty(partyName, {
                        accounts: {
                            author: provider.wallet.publicKey,
                            party: party,
                            systemProgram: web3.SystemProgram.programId,
                        }
                    })

                    //console.log("New party created: " + party.toString())
                    setCreatedParty("Party created");
                }

            } catch (error) {
                setCreatedParty("Error occured");
                console.error(error)

            }
        }
        setTimeout(() => {
            setCreatedParty('');
        }, 2000);
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
                                    <code className="truncate">{"Create Party, but the name has to be UNIQUE !!!"} </code>
                                </pre>
                            </h1>
                        </div>
                    </div>
                </div>
            </h4>
            <div className="flex flex-row justify-center">
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
                        onClick={createParty} disabled={!ourWallet.publicKey || !partyName}
                    >
                        {!createdParty && !ourWallet.publicKey &&
                            <pre data-prefix=">">
                                <code className="truncate">{"Wallet not connected"} </code>
                            </pre>
                        }
                        {!createdParty && ourWallet.publicKey && partyName && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Create Party"} </code>
                            </pre>
                        )}
                        {createdParty && (
                            <pre data-prefix=">">
                                <code className="truncate">{`${createdParty}`} </code>
                            </pre>
                        )}
                        {!createdParty && ourWallet.publicKey && !partyName && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Please enter party name"} </code>
                            </pre>
                        )}
                    </button>
                </div>
            </div>
        </>

    );
};

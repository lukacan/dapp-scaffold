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

export const MyTweets: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');

    const [tweets, setTweets] = useState([])
    const [resultDel, setResultDel] = useState("")
    const [resultUpd, setResultUpd] = useState("")


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const listMyTweets = async () => {
        try {
            console.log("Listing all Tweets")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            // check 8 byte discriminator
            const discriminator = Buffer.from(sha256.digest("account:Tweet")).subarray(0, 8)


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
                })).map(async tweet => ({
                    ...(await program.account.tweet.fetch(tweet.pubkey)),
                    pubkey: tweet.pubkey
                }))).then(tweets => {
                    console.log(tweets)
                    setTweets(tweets)
                })
        } catch (error) {
            console.error(error)
        }
    }

    const updateTweet = async () => {
        setResultUpd("Not Done yet")
        setTimeout(() => {
            setResultUpd('');
        }, 2000);
    }

    const deleteMyTweet = async (tweet_address) => {
        try {
            console.log("Deleteing tweet")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            await program.rpc.deleteTweet({
                accounts: {
                    author: provider.wallet.publicKey,
                    tweet: tweet_address,
                    systemProgram: web3.SystemProgram.programId,
                }

            })
            setResultDel("Successfuly deleted")
        } catch (error) {
            console.error(error)
            setResultDel("Something went wrong")
        }

        setTimeout(() => {
            setResultDel('');
        }, 2000);
    }

    const intToDate = (number) => {
        const date = new Date(number * 1000)
        return date
    }


    return (
        <><h4 className="text-1x1 md:text-1xl text-center text-slate-300 my-2">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                <div className="mx-auto mockup-code bg-primary border-2 border-[#5252529f] p-6 px-2 my-2 text-left">
                    <div className="typing-animation">
                        <h1>
                            <pre data-prefix=">">
                                <code className="truncate">{"List all My Tweets ..."} </code>
                            </pre>
                            <pre data-prefix=">">
                                <code className="truncate">{"Then, you can delete them, or update ..."} </code>
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
                        onClick={listMyTweets} disabled={!ourWallet.publicKey}
                    >
                        {!ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"Connect your wallet"} </code>
                            </pre>
                        )}
                        {ourWallet.publicKey && (
                            <pre data-prefix=">">
                                <code className="truncate">{"List all your Tweets"} </code>
                            </pre>
                        )}
                    </button>
                </div>
            </div>
            {tweets.map((tweet) => {
                return (
                    <div className='md:hero-content flex flex-col'>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                            <div className="mx-auto mockup-code bg-primary p-6 px-4 my-4 text-left" style={{ width: '650px', height: '300px' }}>
                                <div className="typing-animation">
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Topic: " + tweet.topic.toString()} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Created: " + intToDate(tweet.created.toNumber())} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Last modified: " + intToDate(tweet.lastModified.toNumber())} </code>
                                        </pre>
                                    </h1>
                                    <h1>
                                        <pre data-prefix=">">
                                            <code className="truncate">{"Content: " + tweet.content.toString()} </code>
                                        </pre>
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="relative group items-center">
                            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-50 animate-tilt"></div>
                            <div className="mx-auto mockup-code bg-primary p-6 px-4 my-4 text-left" style={{ width: '350px', height: '350px' }}>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-2 border-emerald-400 text-lg pb-2 mb-4 text-white"
                                    placeholder="Enter new topic here"
                                    maxLength={32}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                                <textarea className="w-full h-full message block resize-none bg-transparent border-gray-300 focus:border-indigo-500 text-lg pb-2 mb-4"
                                    placeholder="Enter new tweet content here"
                                    maxLength={500}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center">

                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-lime-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-lime-600 text-black"
                                    onClick={updateTweet} disabled={!ourWallet.publicKey || (!content && !topic)}
                                >
                                    {!ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>

                                    )}
                                    {!resultUpd && ourWallet.publicKey && (content || topic) && (
                                        <code className="truncate">{"Update Tweet"} </code>

                                    )}
                                    {!resultUpd && ourWallet.publicKey && (!content && !topic) && (
                                        <code className="truncate">{"Fill Topic/Tweet or Both"} </code>

                                    )}
                                    {resultUpd && (
                                        <code className="truncate">{`${resultUpd}`} </code>
                                    )}

                                </button>
                            </div>

                            <div className="relative group items-center">
                                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-red-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-red-600 text-black"
                                    onClick={() => deleteMyTweet(tweet.pubkey.toString())} disabled={!ourWallet.publicKey}
                                >
                                    {!ourWallet.publicKey && (
                                        <code className="truncate">{"Wallet not connected"} </code>
                                    )}
                                    {!resultDel && ourWallet.publicKey && (
                                        <code className="truncate">{"Delete Tweet"} </code>
                                    )}
                                    {resultDel && (
                                        <code className="truncate">{`${resultDel}`} </code>
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

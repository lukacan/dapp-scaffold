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

export const ListTweets: FC = () => {
    const ourWallet = useWallet();
    const { connection } = useConnection();
    const [tweettopic, setTweetTopic] = useState('');
    const [tweets, setTweets] = useState([])


    const getProvider = () => {
        const provider = new AnchorProvider(connection,
            ourWallet,
            AnchorProvider.defaultOptions())
        return provider
    }

    const listTweets = async () => {
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
                    }
                    ],
                })).map(async tweet => ({
                    ...(await program.account.tweet.fetch(tweet.pubkey)),
                    pubkey: tweet.pubkey
                }))).then(tweets => {
                    setTweets(tweets)
                })
        } catch (error) {
            console.error(error)
        }
    }

    const listTweetsByTopic = async () => {
        try {

            console.log("Listing Tweets by topic")

            const provider = getProvider()
            const program = new Program(idl_object, programID, provider)

            const discriminator = Buffer.from(sha256.digest("account:Tweet")).subarray(0, 8)
            const topic = Buffer.from(tweettopic)
            Promise.all((await connection.getProgramAccounts(programID,
                {
                    filters: [{
                        memcmp: {
                            offset: 0,
                            bytes: bs58.encode(discriminator)
                        }
                    }, {
                        memcmp: {
                            offset: 60,
                            bytes: bs58.encode(topic)
                        }
                    }
                    ],
                })).map(async tweet => ({
                    ...(await program.account.tweet.fetch(tweet.pubkey)),
                    pubkey: tweet.pubkey
                }))).then(tweets => {
                    setTweets(tweets)
                })

        } catch (error) {
            console.error(error)
        }
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
                                    <code className="truncate">{"List all Tweets or list Tweet(s) by topic ..."} </code>
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
                        onClick={listTweets}
                    >
                        <code className="truncate">{"List all Tweets"} </code>
                    </button>
                </div>
                <input
                    type="text"
                    className="w-60 m-2 p-1 border-2 border-gray-300 rounded-lg text-black"
                    value={tweettopic}
                    maxLength={32}
                    onChange={(e) => setTweetTopic(e.target.value)}
                />
                <div className="relative group items-center">
                    <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-sky-400 to-emerald-400 hover:from-white hover:to-purple-300 text-black"
                        onClick={listTweetsByTopic} disabled={!tweettopic}
                    >
                        {tweettopic ? (<code className="truncate">{"Find Tweet(s)"} </code>) :
                            (<code className="truncate">{"Enter Tweet topic"} </code>)
                        }
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
                                            <code className="truncate">{"Author: " + tweet.author.toString()} </code>
                                        </pre>
                                    </h1>
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
                    </div>
                )
            })}
        </>

    );
};

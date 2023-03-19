import type { NextPage } from "next";
import Head from "next/head";
import { VoteView } from "../views";

const Vote: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <VoteView />
    </div>
  );
};

export default Vote;

import type { NextPage } from "next";
import Head from "next/head";
import { AddVoterView } from "../views";

const AddVoter: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <AddVoterView />
    </div>
  );
};

export default AddVoter;

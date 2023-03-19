import type { NextPage } from "next";
import Head from "next/head";
import { AddPartyView } from "../views";

const AddParty: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <AddPartyView />
    </div>
  );
};

export default AddParty;

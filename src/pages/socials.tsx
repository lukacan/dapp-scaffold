import type { NextPage } from "next";
import Head from "next/head";
import { SocialsView } from "../views";

const Socials: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <SocialsView />
    </div>
  );
};

export default Socials;

import type { NextPage } from "next";
import Head from "next/head";
import { MyTweetsView } from "../views";

const MyTweets: NextPage = (props) => {
  return (
    <div>
      <MyTweetsView />
    </div>
  );
};

export default MyTweets;

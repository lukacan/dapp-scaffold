import type { NextPage } from "next";
import Head from "next/head";
import { ListTweetsView } from "../views";

const ListTweets: NextPage = (props) => {
  return (
    <div>
      <ListTweetsView />
    </div>
  );
};

export default ListTweets;

import type { NextPage } from "next";
import Head from "next/head";
import { MyPartiesView } from "../views";

const MyParties: NextPage = (props) => {
  return (
    <div>
      <MyPartiesView />
    </div>
  );
};

export default MyParties;

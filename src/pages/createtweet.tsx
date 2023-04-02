import type { NextPage } from "next";
import Head from "next/head";
import { CreateTweetView } from "../views";

const CreateTweet: NextPage = (props) => {
  return (
    <div style={{
      display: "flex",
      height: "100%",
    }}>
      <div className="relative group"
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id='show_bg_5'></div>
      </div>
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <CreateTweetView />
      </div>
    </div>
  );
};

export default CreateTweet;

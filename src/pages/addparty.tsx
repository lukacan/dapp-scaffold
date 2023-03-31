import type { NextPage } from "next";
import Head from "next/head";
import { AddPartyView } from "../views";

const AddParty: NextPage = (props) => {
  return (
    <div style={{
      display: "flex",
      height: "100%",
    }}>
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
        <AddPartyView />
      </div>
      <div className="relative group"
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div id='show_bg_2'></div>
      </div>
    </div>
  );
};

export default AddParty;

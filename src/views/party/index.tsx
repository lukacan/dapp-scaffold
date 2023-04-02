
import { FC } from "react";
import { CreateParty } from '../../components/AddParty';
import { MyParties } from '../../components/MyParties';


export const AddPartyView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <CreateParty/>
        </div>
      </div>
    </div>
  );
};



export const MyPartiesView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <MyParties/>
        </div>
      </div>
    </div>
  );
};


import { FC } from "react";
import { CreateParty } from '../../components/AddParty';


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

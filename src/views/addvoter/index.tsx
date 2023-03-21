
import { FC } from "react";
import { AddVoter } from '../../components/AddVoter';


export const AddVoterView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <AddVoter/>
        </div>
      </div>
    </div>
  );
};

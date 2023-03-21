
import { FC } from "react";
import { ListVoter } from '../../components/ListVoter';


export const ListVoterView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <ListVoter/>
        </div>
      </div>
    </div>
  );
};

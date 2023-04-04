
import { FC } from "react";
import { ListVoter } from '../../components/ListVoter';
import { AddVoter } from '../../components/AddVoter';
import { Vote } from '../../components/ListParties';

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


export const AddVoterView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <AddVoter/>
        </div>
      </div>
    </div>
  );
};


export const VoteView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <Vote/>
        </div>
      </div>
    </div>
  );
};
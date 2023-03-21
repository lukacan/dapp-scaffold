
import { FC } from "react";
import { Vote } from '../../components/Vote';


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

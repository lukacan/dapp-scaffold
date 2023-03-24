
import { FC } from "react";
import { Socials } from '../../components/Socials';


export const SocialsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <Socials/>
        </div>
      </div>
    </div>
  );
};

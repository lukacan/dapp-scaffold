
import { FC } from "react";
import { CreateTweet } from '../../components/AddTweet';
import { ListTweets } from '../../components/ListTweets';
import { MyTweets } from '../../components/MyTweets';


export const CreateTweetView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <CreateTweet/>
        </div>
      </div>
    </div>
  );
};



export const ListTweetsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <ListTweets/>
        </div>
      </div>
    </div>
  );
};


export const MyTweetsView: FC = ({ }) => {

  return (
    <div className="md:hero mx-auto p-5">
      <div className="md:hero-content flex flex-col">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <MyTweets/>
        </div>
      </div>
    </div>
  );
};
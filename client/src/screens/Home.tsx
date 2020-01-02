import React from "react";
import { LinkForm, LinkList } from "../components/Link";

const Home: React.FC = () => {
  return (
    <div>
      <LinkForm></LinkForm>
      <LinkList></LinkList>
    </div>
  );
};

export default Home;

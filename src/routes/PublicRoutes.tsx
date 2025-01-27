import React from "react";

type AppProps = {
  component: React.ComponentType<any>;
};

const PublicRoute = ({ component: Component }: AppProps) => {

  return (
    <>
      <Component />
    </>
  );
};

export default PublicRoute;

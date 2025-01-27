import React from 'react'

type AppProps = {
  component: React.ComponentType<any>;
};

const PrivateRoute = ({
  component: Component,
}: AppProps) => {
  return <Component />;
};

export default PrivateRoute;

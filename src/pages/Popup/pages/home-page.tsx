import React from 'react';

import useGlobalStore from '../../../global-stores';

const HomePage = () => {

  const [logOut] = useGlobalStore(state => [state.logOut]);
  return <div>
    <h1>Home page ... page</h1>
    <button onClick={logOut}>
      logout
    </button>
  </div>
    ;
};

export default HomePage;

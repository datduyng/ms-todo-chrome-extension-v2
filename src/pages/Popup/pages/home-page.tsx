import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { WiCloudRefresh } from 'react-icons/wi';

import { getTaskFolders } from '../helpers/msTodoRestApi';
import useGlobalStore from '../../../global-stores';
import FolderView from '../components/folder-view';
import '../button.css';
import { useEffect } from 'react';
import { AllTaskView } from '../components/all-task-view';

const HomePage = () => {
  const [userAuthToken, logOut, fetchTaskFolders] = useGlobalStore((state) => [
    state.userAuthToken,
    state.logOut,
    state.fetchTaskFolders,
  ]);

  useEffect(() => {
    (async () => {
      await fetchTaskFolders();
    })();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div
        style={{
          width: '40px',
          backgroundColor: '#F0F0F0',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <div
          className={'btn-hover-effect'}
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={logOut}
        >
          <FiLogOut fontSize={24} color={'gray'} />
        </div>
        <div
          className={'btn-hover-effect'}
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FiSettings fontSize={24} color={'gray'} />
        </div>
        <div
          className={'btn-hover-effect'}
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <WiCloudRefresh fontSize={35} color={'gray'} />
        </div>
      </div>
      <div style={{ width: '172px' }}>
        <FolderView />
      </div>
      <div style={{ width: '5px', backgroundColor: '#F0F0F0' }}></div>
      <div style={{ width: '345px' }}>
        <AllTaskView />
      </div>
    </div>
  );
};

export default HomePage;

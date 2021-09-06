import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { WiCloudRefresh } from 'react-icons/wi';

import Button from '@atlaskit/button';

import TaskView from '../components/task-view';
import { getTaskFolders } from '../helpers/msTodoRestApi';
import useGlobalStore from '../../../global-stores';
import FolderView from '../components/folder-view';
import '../button.css';
import { useEffect } from 'react';
import { AllTaskView } from '../components/all-task-view';

const getTaskUrl = 'https://graph.microsoft.com/beta/me/outlook/tasks?';
const count = true;
const top = 2147483647;
const delta = true;

const HomePage = () => {
  const [
    userAuthToken,
    logOut,
    fetchTaskFolders,
    getTasksFromFolder,
    selectedTaskId,
    selectedFolderId,
    cloudRefresh,
    cloudRefreshStatus
  ] = useGlobalStore((state) => [
    state.userAuthToken,
    state.logOut,
    state.fetchTaskFolders,
    state.getTasksFromFolder,
    state.selectedTaskId,
    state.selectedFolderId,
    state.cloudRefresh,
    state.cloudRefreshStatus
  ]);

  useEffect(() => {
    (async () => {
      await fetchTaskFolders();
      await getTasksFromFolder(String(selectedFolderId));
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
        {/* <div
          className={'btn-hover-effect'}
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={logOut}
        >
          
        </div> */}
        <Button
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          iconBefore={<FiLogOut fontSize={24} color={'gray'} />}
          onClick={logOut}
        ></Button>
        <Button
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          iconBefore={<FiSettings fontSize={24} color={'gray'} />}
        ></Button>
        <Button
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          isDisabled={cloudRefreshStatus}
          onClick={cloudRefresh}
          iconBefore={<WiCloudRefresh fontSize={35} color={'gray'} />}
        ></Button>
      </div>
      <div style={{ width: '172px', height: '100%' }}>
        <FolderView />
      </div>
      <div style={{ width: '5px', backgroundColor: '#F0F0F0' }}></div>
      <div style={{ width: '345px' }}>
        {!selectedTaskId && <AllTaskView />}
        {selectedTaskId && <TaskView />}
      </div>
    </div>
  );
};

export default HomePage;

import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { WiCloudRefresh } from 'react-icons/wi';

import { getTaskFolders } from '../helpers/msTodoRestApi';
import useGlobalStore from '../../../global-stores';
import FolderView from '../components/folder-view';
import TaskView from '../components/task-view';
import '../button.css';
import { useEffect } from 'react';
import { AllTaskView } from '../components/all-task-view';

const getTaskUrl = 'https://graph.microsoft.com/beta/me/outlook/tasks?';
const count = true;
const top = 2147483647;
const delta = true;


const HomePage = () => {
  const [userAuthToken, logOut, fetchTaskFolders ] = useGlobalStore((state) => [
    state.userAuthToken,
    state.logOut,
    state.fetchTaskFolders
  ]);

  useEffect(() => {
    (async () => {
      await fetchTaskFolders();
    })();
  }, []);

  useEffect(() => {
    // console.log("this is the start of the task queries");
    // tokenStore();
    // fetch(`${getTaskUrl}$count=${count}&$top=${top}&$delta=${delta}`, {
    //   method: 'GET'
    // }).then(response => response.json())
    // .then(json => console.log(json))
    (async () => {
      // const tasks = await fetchTasksFromFolder('AQMkADAwATMwMAItYmIANGEtY2Q3ZC0wMAItMDAKAC4AAAMFPmfsTn1rT7VZiVMsKhDvAQBLoP4WpO8mQKxaCf5vR43yAAACARIAAAA');
      // console.log('The tasks gotten from folder', tasks);
    })

  }, []);

  /*
  The fields I need:
  $count
  $top
  $delta
  */ 





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
      <div style={{ width: '172px', height: '100%' }}>
        <FolderView />
      </div>
      <div style={{ width: '5px', backgroundColor: '#F0F0F0' }}></div>
      <div style={{ width: '345px' }}>
        {/* <AllTaskView /> */}
        <TaskView />
      </div>
      {/* <div id="folderTasks">
          <FolderTasksView />
      </div> */}
      

    </div>
  );
};

export default HomePage;

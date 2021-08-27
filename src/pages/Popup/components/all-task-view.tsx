import React, { useState } from 'react';
import ListIcon from '@atlaskit/icon/glyph/list';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import TextField from '@atlaskit/textfield';

import useGlobalStore from '../../../global-stores';

export const AllTaskView = () => {
  const [selectedFolderInfo] = useGlobalStore((state) => [
    state.selectedFolderInfo,
  ]);
  const [newTask, setNewTask] = useState('');
  const selectedFolder = selectedFolderInfo();

  console.log("Does this thing work?")
  return (
    <div style={{}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '62px',
          alignItems: 'center',
          marginLeft: '14px',
          marginRight: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            wordBreak: 'break-word',
          }}
        >
          <div>
            <ListIcon label={'list icon'} size={'medium'} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {selectedFolder?.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
          }}
        >
          <div>
            <RoomMenuIcon label={'room menu icon'} size={'medium'} />
          </div>

          <div style={{ fontSize: '17px' }}>sort</div>
        </div>
      </div>

      <div style={{
        marginLeft: '10px',
        marginRight: '10px'
      }}>
        <TextField
          style={{
            backgroundColor: '#F1F1F1'
          }}
          placeholder={'Add task and press enter to save'}
          value={newTask}
          onChange={(e) => setNewTask(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Make api call to add task here
              setNewTask('');
            }
          }}
        />
      </div>
    </div>
  );
};

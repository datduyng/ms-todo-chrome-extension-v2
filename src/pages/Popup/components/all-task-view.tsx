import React, { useState } from 'react';
import ListIcon from '@atlaskit/icon/glyph/list';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import TextField from '@atlaskit/textfield';

import useGlobalStore from '../../../global-stores';

import Button, { Appearance, CustomThemeButton } from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import { TaskType } from 'types/ms-todo';
import styled from 'styled-components';
export const AllTaskView = () => {
  const [tasksFromFolder, selectedFolderInfo, createTaskInFolder, selectedFolderId, getTasksFromFolder] = useGlobalStore((state) => [
    state.tasksFromFolder,
    state.selectedFolderInfo,
    state.createTaskInFolder,
    state.selectedFolderId,
    state.getTasksFromFolder
  ]);
  const [newTask, setNewTask] = useState('');
  const selectedFolder = selectedFolderInfo();

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

        {/* <div
          style={{
            display: 'flex',
          }}
        >
          <div>
            <RoomMenuIcon label={'room menu icon'} size={'medium'} />
          </div>

          <div style={{ fontSize: '17px' }}>sort</div>
        </div> */}
      </div>

      <div
        style={{
          marginLeft: '10px',
          marginRight: '10px',
        }}
      >
        <TextField
          style={{
            backgroundColor: '#F1F1F1',
          }}
          placeholder={'Add task and press enter to save'}
          value={newTask}
          onChange={(e) => setNewTask(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Make api call to add task here
              setNewTask('');
              if(newTask === ''){
                return;
              }
              else{
                createTaskInFolder(newTask, String(selectedFolderId));
              }
              
            }
          }}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          marginLeft: '10px',
          marginRight: '10px',
        }}
      >
        <div
          style={{
            overflowY: 'auto',
            maxHeight: '370px',
          }}
        >
          {tasksFromFolder().map((task) => (
            <TaskItem task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ButtonDiv = styled.div`
  align-items: center;
  border-width: 0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  font-size: inherit;
  font-style: normal;
  font-family: inherit;
  max-width: 100%;
  height: 50px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: background 0.1s ease-out,
    box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38);
  white-space: nowrap;
  background: none;
  color: #42526e !important;
  cursor: pointer;
  line-height: 2.2857142857142856em;
  padding: 0 10px;
  vertical-align: middle;
  width: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  &:hover {
    background: rgba(9, 30, 66, 0.08);
    color: #42526e !important;
    -webkit-text-decoration: inherit;
    text-decoration: inherit;
    -webkit-transition-duration: 0s, 0.15s;
    transition-duration: 0s, 0.15s;
  }
`;

const ButtonDivContent = styled.div`
  transition: opacity 0.3s;
  opacity: 1;
  margin: 0 2px;
  flex-grow: 1;
  -webkit-flex-shrink: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  display: table-cell;
  vertical-align: middle;
`;

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const TaskItem = ({ task }: { task: TaskType }) => {
  const [selectTask, updateTaskById] = useGlobalStore((state) => [
    state.selectTask,
    state.updateTaskById,
  ]);
  const completedTask = task.status === 'completed';
  return (
    <ButtonDiv>
      <div>
        <Checkbox
          size={'large'}
          isChecked={completedTask}
          onChange={async (e) => {
            await updateTaskById(task.id, {
              status: e.currentTarget.checked ? 'completed' : 'notStarted'
            })
          }}
        />
      </div>
      <ButtonDivContent
        style={{
          fontWeight: completedTask ? 300 : 500,
          textDecoration: completedTask ? 'line-through' : 'none'
        }}
        onClick={() => {
          selectTask(task.id);
        }}
      >
        {task.subject}
      </ButtonDivContent>
    </ButtonDiv>
  );
};

import React, { useRef } from 'react';
import { BiCalendarCheck, BiCalendar } from 'react-icons/bi';
import { AiFillStar } from 'react-icons/ai';
import ListIcon from '@atlaskit/icon/glyph/list';
import Button from '@atlaskit/button';
import ContextMenu from '../components/context-menu';

import useGlobalStore from '../../../global-stores';

const FilterGroupTask = ({
  name,
  icon,
}: {
  name: string;
  icon: JSX.Element;
}) => {
  return (
    <div
      style={{
        height: '55px',
        width: '80px',
        backgroundColor: '#F0F0F0',
        borderRadius: '10px',
        margin: '2px',
      }}
    >
      <div
        style={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}
      >
        {icon}
      </div>
      <div
        style={{ marginTop: '4px', display: 'flex', justifyContent: 'center' }}
      >
        {name}
      </div>
    </div>
  );
};

const FolderTasksView = () => {
  const [taskFolders, selectedFolderId, updateSelectedFolder, renameTaskFolder, deleteTaskFolder, getTasksFromFolder ] = useGlobalStore(
    (state) => [
      state.taskFolders,
      state.selectedFolderId,
      state.updateSelectedFolder,
      state.renameTaskFolder,
      state.deleteTaskFolder,
      state.getTasksFromFolder
    ]
  );
  const onRename = async (folderId: string, defaultName: string) => {
    if (!folderId) return;
    const newName = window.prompt("Rename folder", defaultName);
    if (newName === defaultName || !newName) {
      return;
    }
    const result = await renameTaskFolder(folderId, newName || "");
    if (result.error) {
      alert(`Error on editing. ${result.error.code} ${result.error.message}`)
    }
  }

  const onDelete = async (folderId: string) => {
    if (!folderId) return;
    const result = await deleteTaskFolder(folderId);
    console.log('result', result);
    if (result && result.error) {
      alert(`Error on editing. ${result.error.code} ${result.error.message}`)
    }
  }
  console.log("The task folder", taskFolders());

  return (
    <div style={{ margin: '2px' }}>
      <div style={{ marginTop: '10px' }}>
        {taskFolders().map((taskFolder) => (
          <ContextMenu
            style={{
              zIndex: 1231232,
            }}
            onRightClick={(e) => {
            }}
            menu={
              <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              >
                <button onClick={() => {
                  onRename(taskFolder.id, taskFolder.name);
                }}>Rename</button>
                <button onClick={() => {
                  onDelete(taskFolder.id);
                }}>Delete</button>
              </div>
            }>
            <Button
              key={taskFolder.id}
              appearance="subtle"
              shouldFitContainer
              style={{
                textAlign: 'left',
                height: '30px',
                fontSize: '15px',
                borderRadius: '10px',
              }}
              iconBefore={<ListIcon label={'list icon'} size={'medium'} />}
              isSelected={taskFolder.id === selectedFolderId}
              onClick={async () => {
                updateSelectedFolder(taskFolder.id);
                let tasksFromFolder = await getTasksFromFolder(taskFolder.id);
                console.log("Tasks retrieved from folder ", taskFolder.name, tasksFromFolder );
              }}
            >
              {taskFolder.name}
            </Button>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
};

export default FolderTasksView;

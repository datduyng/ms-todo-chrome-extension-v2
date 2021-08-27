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
    <Button
      style={{
        height: '55px',
        width: '80px',
        margin: '2px',
        // background: '#F0F0F0',
      }}
      spacing={'none'}
    >
      <div>
        {' '}
        <div
          style={{
            marginTop: '4px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div
          style={{
            marginTop: '1px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {name}
        </div>
      </div>
    </Button>
  );
};

const FolderView = () => {
  const [
    taskFolders,
    selectedFolderId,
    updateSelectedFolder,
    renameTaskFolder,
    deleteTaskFolder,
    createTaskFolder,
    getTasksFromFolder
  ] = useGlobalStore((state) => [
    state.taskFolders,
    state.selectedFolderId,
    state.updateSelectedFolder,
    state.renameTaskFolder,
    state.deleteTaskFolder,
    state.createTaskFolder,
    state.getTasksFromFolder
  ]);
  const onRename = async (folderId: string, defaultName: string) => {
    if (!folderId) return;
    const newName = window.prompt('Rename folder', defaultName);
    if (newName === defaultName || !newName) {
      return;
    }
    const result = await renameTaskFolder(folderId, newName || '');
    if (result.error) {
      alert(`Error on editing. ${result.error.code} ${result.error.message}`);
    }
  };

  const onDelete = async (folderId: string) => {
    if (!folderId) return;
    const result = await deleteTaskFolder(folderId);
    console.log('result', result);
    if (result && result.error) {
      alert(`Error on editing. ${result.error.code} ${result.error.message}`);
    }
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', height: '25%', marginLeft: '2px', marginTop: '2px' }}>
        <FilterGroupTask
          name={'Today'}
          icon={<BiCalendarCheck fontSize={24} color={'gray'} />}
        />
        <FilterGroupTask
          name={'Important'}
          icon={<AiFillStar fontSize={24} color={'gray'} />}
        />
        <FilterGroupTask
          name={'Scheduled'}
          icon={<BiCalendar fontSize={24} color={'gray'} />}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '75%',
          marginLeft: '4px',
          marginRight: '4px',
        }}
      >
        <div
          className="hide-scrollbar"
          style={{ maxHeight: '90%', overflowY: 'auto' }}
        >
          {taskFolders().map((taskFolder) => (
            <ContextMenu
              key={taskFolder.id}
              style={{
                zIndex: 1231232,
              }}
              onRightClick={(e) => {}}
              menu={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <button
                    onClick={() => {
                      onRename(taskFolder.id, taskFolder.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      onDelete(taskFolder.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              }
            >
              <Button
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

        <div>
          <Button
            shouldFitContainer
            appearance={'subtle'}
            onClick={async () => {
              const defaultFolderName = `Untitled_${Date.now()}`;
              const folderName = window.prompt(
                'Enter folder name',
                defaultFolderName
              );
              if (!folderName) {
                if (folderName === '') {
                  window.alert('Folder name cannot be empty');
                }
                return;
              }
              const result = await createTaskFolder(
                folderName || defaultFolderName
              );
              if (result && result.error) {
                window.alert(result.error.message);
              }
            }}
            style={{
              height: '30px',
              font: '20px',
            }}
          >
            + Add list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FolderView;

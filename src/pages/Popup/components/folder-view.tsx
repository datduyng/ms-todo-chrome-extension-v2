import React from 'react';
import { BiCalendarCheck, BiCalendar } from 'react-icons/bi';
import { AiFillStar } from 'react-icons/ai';
import ListIcon from '@atlaskit/icon/glyph/list';
import Button from '@atlaskit/button';

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

const FolderView = () => {
  const [taskFolders] = useGlobalStore((state) => [state.taskFolders]);
  return (
    <div style={{ margin: '2px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
      <div style={{ marginTop: '10px' }}>
        {taskFolders.map((taskFolder) => (
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
          >
            {taskFolder.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FolderView;
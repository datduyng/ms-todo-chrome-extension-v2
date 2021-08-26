import React, { useRef } from 'react';
import ListIcon from '@atlaskit/icon/glyph/list';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';

import useGlobalStore from '../../../global-stores';

export const AllTaskView = () => {
  const [selectedFolderInfo] = useGlobalStore((state) => [
    state.selectedFolderInfo,
  ]);
  const selectedFolder = selectedFolderInfo();
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        height: '62px',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
        }}>
          <div>
          <ListIcon label={'list icon'} size={'medium'} />
          </div>
          <div style={{fontSize: '24px', fontWeight: 'bold' }}>{selectedFolder?.name}</div>
        </div>
        
        <div style={{
          display: 'flex',
        }}>
          <div>
          <RoomMenuIcon label={'room menu icon'} size={'medium'} />

          </div>

          <div style={{fontSize: '17px'}}>
            sort
          </div>
        </div>
      </div>
    </div>
  );
};

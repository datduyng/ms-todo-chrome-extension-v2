import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';

import Button from '@atlaskit/button';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import useGlobalStore from '../../../global-stores';

const TaskView = () => {
  // const [selectedFolderInfo] = useGlobalStore((state) => [
  //   state.selectedFolderInfo,
  // ]);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          marginTop: '10px',
          marginLeft: '10px',
          marginRight: '10px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '10%' }}>
          <Button
            // iconAfter={<StarFilledIcon label="Star icon" size="small" />}
            iconBefore={<ArrowLeftIcon label="arrow left icon" size="medium" />}
            appearance="subtle"
          ></Button>
        </div>
        <div style={{ width: '7%' }}>
          <Checkbox
            isChecked={true}
            onChange={() => {}}
            name="checkbox-default"
            testId="cb-default"
            size="large"
          />
        </div>

        <div
          style={{
            width: '2px',
            marginLeft: '15px',
            background: '#F0F0F0',
            minHeight: '25px',
          }}
        ></div>
        <div style={{width: '6%', paddingLeft: '10px'}}>
          <CalendarIcon label="calendar icon" size="medium" primaryColor="gray"/>
        </div>
        <div style={{ width: '70%', paddingLeft: '6px', paddingRight: '5px' }}>
          <DateTimePicker appearance={"subtle"} defaultValue={"default"}/>
        </div>
        <div style={{ width: '10%' }}>
          <Button
            // iconAfter={<StarFilledIcon label="Star icon" size="small" />}
            iconBefore={<StarFilledIcon label="Star icon" size="medium" />}
            appearance="subtle"
          ></Button>
        </div>
      </div>

      <div>
        <div contentEditable={true} id="myContentEditable" style={{
          fontWeight: 'bold',
          fontSize: '20px'
        }}>name</div>
        <div contentEditable={true} id="myContentEditable" style={{
          fontSize: '13px'
        }}>
          Description
          </div>
      </div>
    </div>
  );
};

export default TaskView;

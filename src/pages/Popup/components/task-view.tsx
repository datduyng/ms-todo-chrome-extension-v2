import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '@atlaskit/button';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import useGlobalStore from '../../../global-stores';

const TaskView = () => {
  // const [selectedFolderInfo] = useGlobalStore((state) => [
  //   state.selectedFolderInfo,
  // ]);
  return (
    <div style={{}}>
      <div>
        <DateTimePicker />
        <Checkbox
          isChecked={true}
          onChange={() => {}}
          name="checkbox-default"
          testId="cb-default"
        />

        <Button
          // iconAfter={<StarFilledIcon label="Star icon" size="small" />}
          iconBefore={<StarFilledIcon label="Star icon" size="medium" />}
          appearance="subtle"
        >
          
        </Button>
      </div>

      <div>
        <div>Name</div>
        <div>Description</div>
      </div>
    </div>
  );
};

export default TaskView;

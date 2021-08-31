import React, { useState } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import StarIcon from '@atlaskit/icon/glyph/star';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';

import Button from '@atlaskit/button';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import useGlobalStore from '../../../global-stores';
import { useEffect } from 'react';
import { TaskType } from 'types/ms-todo';

const defaultTask = {
  subject: '',
  body: {
    content: '',
  },
  status: 'notStarted',
  importance: 'normal',
} as TaskType;
const TaskView = () => {
  const [selectTask, selectedTaskInfo] = useGlobalStore((state) => [
    state.selectTask,
    state.selectedTaskInfo,
  ]);
  const currentTask = selectedTaskInfo();
  const [isBodyEmpty, setIsBodyEmpty] = useState(true);
  const [taskForm, setTaskForm] = useState(defaultTask);
  const [isDirtyTaskSync, SetIsDirtyTaskSync] = useState(false);
  useEffect(() => {
    let htmlParser = new DOMParser();
    let htmlNoteDOM = htmlParser.parseFromString(
      currentTask?.body?.content || '',
      'text/html'
    );
    let textBody =
      htmlNoteDOM.getElementsByClassName('PlainText')[0]?.textContent || '';
    setIsBodyEmpty(textBody?.trim()?.length > 0 ? false : true);
    setTaskForm(currentTask || defaultTask);
  }, [currentTask?.body.content]);

  useEffect(() => {
    setTaskForm(currentTask || defaultTask);
  }, [
    currentTask?.subject,
    currentTask?.body.content,
    currentTask?.status,
    currentTask?.importance,
  ]);

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
            onClick={() => {
              selectTask(null);
            }}
            // iconAfter={<StarFilledIcon label="Star icon" size="small" />}
            iconBefore={<ArrowLeftIcon label="arrow left icon" size="medium" />}
            appearance="subtle"
          ></Button>
        </div>
        <div style={{ width: '7%' }}>
          <Checkbox
            isChecked={taskForm.status === 'completed'}
            onChange={(e) => {
              SetIsDirtyTaskSync(true);
              setTaskForm({
                ...taskForm,
                status: e.currentTarget.checked ? 'completed' : 'notStarted'
              });
            }}
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
        <div style={{ width: '6%', paddingLeft: '10px' }}>
          <CalendarIcon
            label="calendar icon"
            size="medium"
            primaryColor="gray"
          />
        </div>
        <div style={{ width: '70%', paddingLeft: '6px', paddingRight: '5px' }}>
          <DateTimePicker appearance={'subtle'} defaultValue={'default'} />
        </div>
        <div style={{ width: '10%' }}>
          <Button
            // iconAfter={<StarFilledIcon label="Star icon" size="small" />}
            iconBefore={
              taskForm.importance === 'high' ? (
                <StarFilledIcon label="Star filled icon" size="medium" />
              ) : (
                <StarIcon label="Star icon" size="medium" />
              )
            }
            onClick={() => {
              SetIsDirtyTaskSync(true);
              setTaskForm({
                ...taskForm,
                importance: taskForm.importance === 'high' ? 'normal' : 'high',
              });
            }}
            appearance="subtle"
          ></Button>
        </div>
      </div>

      <div style={{ height: '5px', background: '#F0F0F0' }}></div>

      <div
        style={{
          margin: '10px',
          textAlign: 'right',
        }}
      >
        {isDirtyTaskSync ? 'not saved' : ''}
      </div>
      <div
        style={{
          margin: '15px',
        }}
      >
        <div
          contentEditable={true}
          id="myContentEditable"
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            maxHeight: '70px',
            overflowY: 'auto',
          }}
          onInput={(e) => {
            SetIsDirtyTaskSync(true);
            setTaskForm({
              ...taskForm,
              subject: e.currentTarget.innerHTML,
            });
          }}
          suppressContentEditableWarning={true}
        >
          {taskForm.subject}
        </div>
        <div
          onInput={(e) => {
            console.log('e', e.currentTarget.innerHTML);
            SetIsDirtyTaskSync(true);
            setTaskForm({
              ...taskForm,
              body: {
                ...taskForm.body,
                content: e.currentTarget.innerHTML,
              },
            });
          }}
          contentEditable={true}
          id="myContentEditable"
          style={{
            fontSize: '13px',
            marginTop: '15px',
            height: '340px',
            overflowY: 'auto',
          }}
          dangerouslySetInnerHTML={{
            __html: isBodyEmpty ? 'Description' : taskForm.body.content || '',
          }}
          suppressContentEditableWarning={true}
        ></div>
      </div>
    </div>
  );
};

export default TaskView;

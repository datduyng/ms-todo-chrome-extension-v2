import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce';
import { Checkbox } from '@atlaskit/checkbox';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';
import StarIcon from '@atlaskit/icon/glyph/star';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';

import useAnalytics, { AnalyticTypes } from '../../../global-stores/use-analytics';


import ContentEditable from 'react-contenteditable';

import Button from '@atlaskit/button';
import { DateTimePicker } from '@atlaskit/datetime-picker';

import useGlobalStore from '../../../global-stores';
import { useEffect } from 'react';
import { TaskType, UpdateTaskInputType } from 'types/ms-todo';

const defaultTask = {
  subject: '',
  body: {
    content: '',
  },
  status: 'notStarted',
  importance: 'normal',
} as TaskType;

function convertTZ(date: Date, tzString: string) {
  return new Date(new Date(date).toLocaleString('en-US', { timeZone: tzString }));
}

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const getDisplayDate = (dateTime: string | undefined) =>
  dateTime ? convertTZ(new Date(dateTime), currentTimeZone).toISOString() : '';
const getUtcFromDisplayDate = (dateTime: string) =>
  new Date(dateTime).toISOString();

const TaskView = () => {
  const [
    selectTask,
    selectedTaskInfo,
    updateTaskById,
    selectedTaskId,
    savingTaskStatus,
  ] = useGlobalStore((state) => [
    state.selectTask,
    state.selectedTaskInfo,
    state.updateTaskById,
    state.selectedTaskId,
    state.savingTaskStatus,
  ]);
  const currentTask = selectedTaskInfo();
  const [isBodyEmpty, setIsBodyEmpty] = useState(true);
  const [taskForm, setTaskForm] = useState(currentTask || defaultTask);

  const updateTaskForm = (value: React.SetStateAction<TaskType>) => {
    setTaskForm(value);
    debouncedSubjectSave(value);
  };
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
  }, [currentTask?.body.content]);

  const debouncedSubjectSave = useRef(
    debounce(async (nextValue) => {
      const result = await updateTaskById(selectedTaskId || '', nextValue);
      if (result && result.error?.code) {
      } else {
        SetIsDirtyTaskSync(false);
      }
    }, 500)
  ).current;

  console.log('display', getDisplayDate(taskForm.dueDateTime?.dateTime));
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
              if (!e.currentTarget.checked) {
                useAnalytics.getInstance().logEvent(AnalyticTypes.MARK_TASK_DONE);
              }
              updateTaskForm({
                ...taskForm,
                status: e.currentTarget.checked ? 'completed' : 'notStarted',
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
          <DateTimePicker
            appearance={'subtle'}
            defaultValue={'default'}
            datePickerProps={{
              onChange: (value) => {
                value = value + 'T13:00:00.000Z'
                SetIsDirtyTaskSync(true);
                updateTaskForm({
                  ...taskForm,
                  dueDateTime: {
                    timeZone: taskForm.dueDateTime?.timeZone || 'UTC',
                    dateTime: getUtcFromDisplayDate(value),
                  },
                });
              },
              value:
                getDisplayDate(taskForm?.dueDateTime?.dateTime) || undefined,
            }}
            timePickerProps={{
              isDisabled: true,
            }}
          />
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
              updateTaskForm({
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
        {savingTaskStatus ? 'Saving' : isDirtyTaskSync ? 'Not saved' : 'Saved'}
      </div>
      <div
        style={{
          margin: '15px',
        }}
      >
        <ContentEditable
          id="myContentEditable"
          html={taskForm.subject}
          onChange={(e) => {
            SetIsDirtyTaskSync(true);
            updateTaskForm({
              ...taskForm,
              subject: e.target.value,
            });
          }}
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            maxHeight: '70px',
            overflowY: 'auto',
          }}
        />

        <ContentEditable
          id="myContentEditable"
          html={isBodyEmpty ? 'Description' : taskForm.body.content || ''}
          onChange={(e) => {
            SetIsDirtyTaskSync(true);
            updateTaskForm({
              ...taskForm,
              body: {
                ...taskForm.body,
                content: e.target.value,
              },
            });
          }}
          style={{
            fontSize: '13px',
            marginTop: '15px',
            height: '310px',
            overflowY: 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default TaskView;

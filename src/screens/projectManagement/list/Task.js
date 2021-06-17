/**
 ** Name: List Task screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/* COMPONENTS */
import CList from '~/components/CList';
import TaskItem from '../components/TaskItem';
/** COMMON */
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';

let isPrevIsParent = false;

function ListTask(props) {
  const navigation = useNavigation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {refreshing, onRefreshTasks} = props;

  /** HANDLE FUNC */
  const handleTaskItem = data => {
    navigation.navigate(Routes.MAIN.TASK_DETAIL.name, {
      data: {
        taskID: data.taskID,
        isUpdated: data.isUpdated,
      },
      onRefresh: () => onRefreshTasks(),
    });
  };

  /** RENDER */
  return (
    <CList
      contentStyle={cStyles.pt16}
      scrollToTop={false}
      textEmpty={'project_management:empty_tasks'}
      data={props.data}
      item={({item, index}) => {
        isPrevIsParent = false;
        if (props.data[index - 1] && props.data[index - 1].countChild > 0) {
          isPrevIsParent = true;
        }
        return (
          <TaskItem
            index={index}
            data={item}
            customColors={customColors}
            isDark={isDark}
            isPrevIsParent={isPrevIsParent}
            onPress={handleTaskItem}
            onRefresh={onRefreshTasks}
          />
        );
      }}
      refreshing={refreshing}
      onRefresh={onRefreshTasks}
    />
  );
}

export default ListTask;

/**
 ** Name: List Task screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {View} from 'react-native';
/* COMPONENTS */
import CList from '~/components/CList';
import TaskItem from '../components/TaskItem';
/** COMMON */
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';

function ListTask(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {onLoadmore, onRefreshTasks} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleTaskItem = data => {
    navigation.navigate(Routes.MAIN.TASK_DETAIL.name, {
      data: {
        taskID: data.taskID,
        isUpdated: data.isUpdated,
      },
      onRefresh: () => onRefreshTasks(),
    });
  };

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.flex1}>
      <CList
        style={cStyles.mt10}
        contentStyle={cStyles.p10}
        textEmpty={'project_management:empty_tasks'}
        data={props.data}
        item={({item, index}) => {
          return (
            <TaskItem
              index={index}
              data={item}
              translation={t}
              customColors={customColors}
              isDark={isDark}
              onPress={handleTaskItem}
              onRefresh={onRefreshTasks}
            />
          );
        }}
        refreshing={props.refreshing}
        onRefresh={onRefreshTasks}
        loadingmore={props.loadmore}
        onLoadmore={onLoadmore}
      />
    </View>
  );
}

export default ListTask;

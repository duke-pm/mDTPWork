/**
 ** Name: List Task screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {List, useTheme} from '@ui-kitten/components';
import {View} from 'react-native';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
import TaskItem from '../components/TaskItem';
/** COMMON */
import Routes from '~/navigator/Routes';
import {cStyles} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';

function ListTask(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme();
  const {
    onLoadmore = undefined,
    onRefreshTasks = undefined,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleTaskItem = data => {
    if (data.countChild > 0) {
      navigation.push(Routes.TASKS.name, {
        data: {
          taskID: data.taskID,
          projectID: data.prjID,
          projectName: data.prjName,
          projectStatus: data.statusName,
        },
      });
    } else {
      navigation.navigate(Routes.TASK_DETAILS.name, {
        data: {
          taskID: data.taskID,
          isUpdated: data.isUpdated,
        },
        onRefresh: () => onRefreshTasks(),
      });
    }
  };

  /************
   ** RENDER **
   ************/
  const RenderTaskItem = info => {
    return (
      <TaskItem
        theme={theme}
        trans={t}
        index={info.index}
        data={info.item}
        onPress={handleTaskItem}
        onRefresh={onRefreshTasks}
      />
    );
  };

  return (
    <View style={cStyles.flex1}>
      {/** List of task */}
      <List
        contentContainerStyle={cStyles.p10}
        data={props.data}
        renderItem={RenderTaskItem}
        keyExtractor={(item, index) => item.taskID + '_' + index}
        removeClippedSubviews={IS_ANDROID}
        refreshing={props.refreshing}
        onRefresh={onRefreshTasks}
        onEndReachedThreshold={0.1}
        onEndReached={onLoadmore}
        ItemSeparatorComponent={() => <View style={cStyles.my5} />}
        ListEmptyComponent={<CEmpty />}
      />
    </View>
  );
}

ListTask.propTypes = {
  data: PropTypes.array,
  refreshing: PropTypes.bool,
  loadmore: PropTypes.bool,
  onLoadmore: PropTypes.func,
  onRefreshTasks: PropTypes.func,
};

export default ListTask;

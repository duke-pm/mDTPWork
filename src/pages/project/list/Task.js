/**
 ** Name: List Task screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useTheme, List} from '@ui-kitten/components';
import {View} from 'react-native';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
import TaskItem from '../components/TaskItem';
/** COMMON */
import Routes from '~/navigator/Routes';
import {cStyles} from '~/utils/style';
import {ThemeContext} from '~/configs/theme-context';
import {DARK} from '~/configs/constants';

function ListTask(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
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
  return (
    <View style={cStyles.flex1}>
      <List
        contentContainerStyle={[cStyles.py10, cStyles.px16]}
        data={props.data}
        renderItem={info => {
          return (
            <TaskItem
              trans={t}
              theme={theme}
              isDark={themeContext.themeApp === DARK}
              index={info.index}
              data={info.item}
              onPress={handleTaskItem}
              onRefresh={onRefreshTasks}
            />
          );
        }}
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

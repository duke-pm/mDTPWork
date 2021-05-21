/**
 ** Name: List Task screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React from 'react';
import {useNavigation} from '@react-navigation/native';
/* COMPONENTS */
import TaskItem from '../components/TaskItem';
import CList from '~/components/CList';
/** COMMON */
import Routes from '~/navigation/Routes';

function ListTask(props) {
  const navigation = useNavigation();
  const {customColors, isDark, onLoadmore, onRefresh, onChangeStatus} = props;

  /** HANDLE FUNC */
  const handleTaskItem = data => {};

  /** RENDER */
  return (
    <CList
      data={props.data}
      item={({item, index}) => {
        return (
          <TaskItem
            index={index}
            data={item}
            customColors={customColors}
            darkMode={isDark}
            onRefresh={onRefresh}
            onPress={handleTaskItem}
            onChangeStatus={onChangeStatus}
          />
        );
      }}
      refreshing={props.refreshing}
      onRefresh={onRefresh}
      loadingmore={props.loadmore}
      onLoadmore={onLoadmore}
      showScrollTop={false}
    />
  );
}

export default ListTask;

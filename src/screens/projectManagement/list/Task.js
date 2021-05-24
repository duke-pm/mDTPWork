/**
 ** Name: List Task screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React from 'react';
/* COMPONENTS */
import TaskItem from '../components/TaskItem';
import CList from '~/components/CList';

function ListTask(props) {
  const {customColors, isDark, onLoadmore, onRefresh} = props;

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
            isDark={isDark}
            onRefresh={onRefresh}
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

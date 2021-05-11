/**
 ** Name: CList
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React from 'react';
import {
  FlatList
} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CFooterList from './CFooterList';
/* COMMON */
import { IS_ANDROID } from '~/utils/helper';
import { cStyles } from '~/utils/style';

function CList(props) {
  const {
    style = {},
    contentStyle = {},
    onPressItem = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  return (
    <FlatList
      style={[cStyles.flex1, style]}
      contentContainerStyle={[cStyles.px16, contentStyle]}
      data={props.data}
      renderItem={props.item}
      keyExtractor={(item, index) => index.toString()}
      removeClippedSubviews={IS_ANDROID}
      initialNumToRender={10}

      refreshing={props.refreshing}
      onRefresh={onRefresh}

      onEndReachedThreshold={0.1}
      onEndReached={onLoadmore}

      ListEmptyComponent={
        <CEmpty
          label={'common:empty_data'}
          description={'common:cannot_find_data_filter'}
        />
      }
      ListFooterComponent={props.loadingmore ? <CFooterList /> : null}
    />
  );
};

export default CList;

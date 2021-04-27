/**
 ** Name: 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React from 'react';
import {
  FlatList
} from 'react-native';
/* COMPONENTS */
import RequestItem from '../components/RequestItem';
/* COMMON */
import { IS_ANDROID } from '~/utils/helper';

function ListRequest(props) {

  return (
    <FlatList
      data={props.data}
      renderItem={({ item, index }) => {
        return (
          <RequestItem
            index={index}
            data={item}
          />
        )
      }}
      keyExtractor={(item, index) => index.toString()}
      removeClippedSubviews={IS_ANDROID}
    />
  );
};

export default ListRequest;

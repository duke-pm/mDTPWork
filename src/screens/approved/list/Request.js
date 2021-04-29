/**
 ** Name: 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React, { useState } from 'react';
import {
  View,
  FlatList,
} from 'react-native';
/* COMPONENTS */
import RequestItem from '../components/RequestItem';
import CEmpty from '~/components/CEmpty';
import CFooterList from '~/components/CFooterList';
import ModalProcess from '../components/ModalProcess';
/* COMMON */
import { IS_ANDROID } from '~/utils/helper';
import { cStyles } from '~/utils/style';

function ListRequest(props) {
  const {
    onLoadmore,
    onRefresh,
  } = props;

  const [modal, setModal] = useState({
    show: false,
    data: null,
    dataProcess: null,
  });

  /** HANDLE FUNC */
  const handleShowModal = (request) => {
    setModal({
      show: true,
      data: request,
      dataProcess: props.dataProcess,
    });
  };

  const handleCloseModal = () => {
    setModal({
      show: false,
      data: null,
      dataProcess: null,
    });
  };

  /** RENDER */
  return (
    <View style={cStyles.flex1}>
      <FlatList
        style={[cStyles.flex1, cStyles.mt16]}
        data={props.data}
        renderItem={({ item, index }) => {
          let detail = props.dataDetail.filter(f => f.requestID === item.requestID);
          let process = props.dataProcess.filter(f => f.requestID === item.requestID);
          process = process.sort((a, b) => a.levelApproval - b.levelApproval);
          return (
            <RequestItem
              index={index}
              data={item}
              dataDetail={detail}
              dataProcess={process}
              onPressProcess={handleShowModal}
            />
          )
        }}
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={IS_ANDROID}
        showsVerticalScrollIndicator={false}
        refreshing={props.refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={onLoadmore}
        ListEmptyComponent={
          <CEmpty
            label={'common:empty_data'}
            description={'common:cannot_find_data_filter'}
          />
        }
        ListFooterComponent={props.loadmore ? <CFooterList /> : null}
      />

      <ModalProcess
        show={modal.show}
        dataRequest={modal.data}
        dataProcess={modal.dataProcess}
        onPressClose={handleCloseModal}
      />
    </View>
  );
};

export default ListRequest;

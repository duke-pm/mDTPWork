/**
 ** Name: List Request
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of ListRequest.js
 **/
import React from 'react';
/* COMPONENTS */
import RequestItem from '../../components/RequestItem';
import CList from '~/components/CList';
/* COMMON */
import { cStyles } from '~/utils/style';

function ListRequest(props) {
  const {
    onLoadmore,
    onRefresh,
  } = props;

  /** RENDER */
  return (
    <CList
      style={cStyles.mt16}
      data={props.data}
      item={(index, data, onPress) => {
        let detail = props.dataDetail.filter(f => f.requestID === data.requestID);
        let process = props.dataProcess.filter(f => f.requestID === data.requestID);
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            isLostDamage={true}
            index={index}
            data={data}
            dataDetail={detail}
            dataProcess={process}
            onRefresh={onRefresh}
          />
        )
      }}
      refreshing={props.refreshing}
      onRefresh={onRefresh}
      loadingmore={props.loadmore}
      onLoadmore={onLoadmore}
    />
  );
};

export default ListRequest;

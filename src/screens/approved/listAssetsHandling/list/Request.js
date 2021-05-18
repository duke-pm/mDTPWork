/**
 ** Name: List Request
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ListRequest.js
 **/
import React from 'react';
/* COMPONENTS */
import RequestItem from '~/screens/approved/components/RequestItem';
import CList from '~/components/CList';
/* COMMON */
import {cStyles} from '~/utils/style';

function ListRequest(props) {
  const {onLoadmore, onRefresh} = props;

  /** RENDER */
  return (
    <CList
      style={cStyles.mt16}
      data={props.data}
      item={({item, index, scrollY}) => {
        let detail = props.dataDetail.filter(
          f => f.requestID === item.requestID,
        );
        let process = props.dataProcess.filter(
          f => f.requestID === item.requestID,
        );
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            index={index}
            data={item}
            dataDetail={detail}
            dataProcess={process}
            scrollY={scrollY}
            onRefresh={onRefresh}
          />
        );
      }}
      refreshing={props.refreshing}
      onRefresh={onRefresh}
      loadingmore={props.loadmore}
      onLoadmore={onLoadmore}

      animation={true}
    />
  );
}

export default ListRequest;

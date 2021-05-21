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
import {cStyles} from '~/utils/style';

function ListRequest(props) {
  const {onLoadmore, onRefresh} = props;

  /** RENDER */
  return (
    <CList
      style={cStyles.pt16}
      data={props.data}
      item={({item, index}) => {
        let detail = props.dataDetail.filter(
          f => f.requestID === item.requestID,
        );
        let process = props.dataProcess.filter(
          f => f.requestID === item.requestID,
        );
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            isLostDamage={false}
            index={index}
            data={item}
            dataDetail={detail}
            dataProcess={process}
            customColors={props.customColors}
            onRefresh={onRefresh}
          />
        );
      }}
      refreshing={props.refreshing}
      onRefresh={onRefresh}
      loadingmore={props.loadmore}
      onLoadmore={onLoadmore}
    />
  );
}

export default ListRequest;

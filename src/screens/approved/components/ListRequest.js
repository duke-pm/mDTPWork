/**
 ** Name: List Request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListRequest.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
/* COMPONENTS */
import CList from '~/components/CList';
import RequestItem from './RequestItem';
/* COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {cStyles} from '~/utils/style';

ListRequest.propTypes = {
  permissionWrite: PropTypes.bool.isRequired,
  customColors: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
  onLoadmore: PropTypes.func,
  routeDetail: PropTypes.oneOf([
    'auto',
    Routes.MAIN.ADD_APPROVED_ASSETS.name,
    Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name,
  ]).isRequired,
};

function ListRequest(props) {
  const navigation = useNavigation();
  const {
    permissionWrite = false,
    customColors = {},
    onLoadmore = undefined,
    onRefresh = undefined,
    routeDetail = Routes.MAIN.ADD_APPROVED_ASSETS.name,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRequestItem = (data, dataProcess, dataDetail, currentProcess) => {
    let route = routeDetail;
    if (routeDetail === 'auto') {
      route = Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name;
      if (data.requestTypeID === Commons.APPROVED_TYPE.ASSETS.value) {
        route = Routes.MAIN.ADD_APPROVED_ASSETS.name;
      }
    }
    navigation.navigate(route, {
      data,
      dataProcess,
      dataDetail,
      currentProcess,
      permissionWrite: permissionWrite || false,
      onRefresh: () => onRefresh(),
    });
  };

  /************
   ** RENDER **
   ************/
  let detail = null,
    process = null;
  return (
    <CList
      contentStyle={cStyles.pt10}
      data={props.data}
      item={({item, index}) => {
        detail = props.dataDetail.filter(f => f.requestID === item.requestID);
        process = props.dataProcess.filter(f => f.requestID === item.requestID);
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            index={index}
            data={item}
            dataDetail={detail}
            dataProcess={process}
            customColors={customColors}
            onPress={handleRequestItem}
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

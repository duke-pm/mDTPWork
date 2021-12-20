/**
 ** Name: List Request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListRequest.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {List} from '@ui-kitten/components';
import {View} from 'react-native';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
import CFooterList from '~/components/CFooterList';
import RequestItem from './RequestItem';
/* COMMON */
import Routes from '~/navigator/Routes';
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';

function ListRequest(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {
    permissionWrite = false,
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
      route = Routes.ADD_APPROVED_LOST_DAMAGED.name;
      if (data.requestTypeID === Commons.APPROVED_TYPE.ASSETS.value) {
        route = Routes.ADD_APPROVED_ASSETS.name;
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
    <List
      contentContainerStyle={[cStyles.px16, cStyles.py10]}
      data={props.data}
      renderItem={info => {
        detail = props.dataDetail.filter(f => f.requestID === info.item.requestID);
        process = props.dataProcess.filter(f => f.requestID === info.item.requestID);
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            trans={t}
            index={info.index}
            data={info.item}
            dataDetail={detail}
            dataProcess={process}
            onPress={handleRequestItem}
          />
        )
      }}
      keyExtractor={(item, index) => 'listApprovedHanding_' + index.toString()}
      refreshing={props.refreshing}
      onEndReachedThreshold={0.1}
      onRefresh={onRefresh}
      onEndReached={onLoadmore}
      ItemSeparatorComponent={() => <View style={cStyles.py5} />}
      ListEmptyComponent={
        <CEmpty
          label={'common:empty_data'}
          description={'common:cannot_find_data_filter'}
        />
      }
      ListFooterComponent={props.loadmore ? <CFooterList /> : null}
    />
  );
}

ListRequest.propTypes = {
  permissionWrite: PropTypes.bool.isRequired,
  customColors: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
  onLoadmore: PropTypes.func,
  routeDetail: PropTypes.oneOf([
    'auto',
    'AddRequestAsset',
    'AddRequestLostDamage',
  ]).isRequired,
};

export default ListRequest;

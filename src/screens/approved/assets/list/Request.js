/**
 ** Name: List Request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ListRequest.js
 **/
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {StyleSheet} from 'react-native';
/* COMPONENTS */
import RequestItem from '../../components/RequestItem';
import CList from '~/components/CList';
/* COMMON */
import Routes from '~/navigation/Routes';
import {cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';

function ListRequest(props) {
  const navigation = useNavigation();
  const {permissionWrite, customColors, onLoadmore, onRefresh} = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRequestItem = (data, dataProcess, dataDetail) => {
    navigation.navigate(Routes.MAIN.ADD_APPROVED_ASSETS.name, {
      data: data,
      dataProcess: dataProcess,
      dataDetail: dataDetail,
      permissionWrite: permissionWrite || false,
      onRefresh: () => onRefresh(),
    });
  };

  /**************
   ** RENDER **
   **************/
  let detail = null,
    process = null;
  return (
    <CList
      style={cStyles.pt16}
      contentStyle={IS_IOS ? styles.content : {}}
      data={props.data}
      item={({item, index}) => {
        detail = props.dataDetail.filter(f => f.requestID === item.requestID);
        process = props.dataProcess.filter(f => f.requestID === item.requestID);
        process = process.sort((a, b) => a.levelApproval - b.levelApproval);
        return (
          <RequestItem
            isLostDamage={false}
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

const styles = StyleSheet.create({
  content: {
    paddingBottom: isIphoneX() ? 100 : 60,
  },
});

export default ListRequest;

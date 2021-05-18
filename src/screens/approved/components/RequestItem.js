/**
 ** Name: Request Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigation/Routes';
import {cStyles} from '~/utils/style';
import Commons from '~/utils/common/Commons';
import Assets from '~/utils/asset/Assets';

const RequestItem = React.memo(function RequestItem(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {colors} = useTheme();

  const commonState = useSelector(({common}) => common);

  /** HANDLE FUNC */
  const handleRequestItem = () => {
    let route = Routes.MAIN.ADD_APPROVED_LOST_DAMAGED.name;
    if (props.data.requestTypeID === Commons.APPROVED_TYPE.ASSETS.code) {
      route = Routes.MAIN.ADD_APPROVED_ASSETS.name;
    }

    navigation.navigate(route, {
      data: props.data,
      dataProcess: props.dataProcess,
      dataDetail: props.dataDetail,
      onRefresh: () => props.onRefresh(),
    });
  };

  /** RENDER */
  let title = t('approved_assets:title_request_item') + props.data.requestID;
  let statusIcon = Assets.iconRequest;
  let colorText = 'colorOrange';

  if (props.data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.code) {
    title =
      t('approved_lost_damaged:title_request_item_1') +
      props.data.requestTypeName +
      t('approved_lost_damaged:title_request_item_2') +
      props.data.requestID;
  }

  if (
    props.data.statusID === Commons.STATUS_REQUEST.APPROVED.code ||
    props.data.statusID === Commons.STATUS_REQUEST.DONE.code
  ) {
    statusIcon = Assets.iconApproved;
    colorText = 'colorGreen';
  } else if (props.data.statusID === Commons.STATUS_REQUEST.REJECT.code) {
    statusIcon = Assets.iconReject;
    colorText = 'colorRed';
  }

  return (
    <TouchableOpacity disabled={props.loading} onPress={handleRequestItem}>
      <View style={[cStyles.py10, props.index !== 0 && cStyles.borderTop]}>
        <View style={cStyles.flex1}>
          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.itemsStart,
              cStyles.justifyBetween,
            ]}>
            <View style={[cStyles.row, cStyles.itemsStart]}>
              <Image
                style={styles.icon_status}
                source={statusIcon}
                resizeMode={'contain'}
              />
              <CText styles={'textTitle pl10'} customLabel={title} />
            </View>
          </View>

          <View
            style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
            <View style={[cStyles.flex1, cStyles.pt10]}>
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyBetween,
                ]}>
                <View
                  style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                  <CText
                    styles={'textMeta'}
                    label={'approved_lost_damaged:date_request'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={moment(
                      props.data.requestDate,
                      'YYYY-MM-DDTHH:mm:ss',
                    ).format(commonState.get('formatDateView'))}
                  />
                </View>

                <View style={[cStyles.row, cStyles.itemsStart]}>
                  <CText
                    styles={'textMeta'}
                    label={'approved_lost_damaged:status_request'}
                  />
                  <CText
                    styles={'textMeta fontBold ' + colorText}
                    customLabel={props.data.statusName}
                  />
                </View>
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyBetween,
                ]}>
                <View
                  style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                  <CText
                    styles={'textMeta'}
                    label={'approved_lost_damaged:region_request'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={props.data.regionName}
                  />
                </View>

                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyEnd,
                    styles.header_right,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'approved_lost_damaged:user_request'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={props.data.personRequest}
                  />
                </View>
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyBetween,
                ]}>
                <View
                  style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                  <CText
                    styles={'textMeta'}
                    label={'approved_lost_damaged:department_request'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={props.data.deptName}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  header_left: {
    flex: 0.5,
  },
  header_right: {
    flex: 0.5,
  },

  icon_status: {
    height: 20,
    width: 20,
  },
});

export default RequestItem;

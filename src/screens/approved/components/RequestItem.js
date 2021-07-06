/**
 ** Name: Request Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CLabel from '~/components/CLabel';
/* COMMON */
import Commons from '~/utils/common/Commons';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';

function RequestItem(props) {
  const {t} = useTranslation();
  const {loading, customColors, data, dataProcess, dataDetail, onPress} = props;

  /** Use redux */
  const commonState = useSelector(({common}) => common);
  const formatDateView = commonState.get('formatDateView');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRequestItem = () => {
    onPress(data, dataProcess, dataDetail);
  };

  /**************
   ** RENDER **
   **************/
  let title = t('approved_assets:title_request_item') + data.requestID;
  let statusIcon = Assets.iconRequest;
  let colorText = 'colorOrange';
  if (data.requestTypeID !== Commons.APPROVED_TYPE.ASSETS.value) {
    title =
      t('approved_lost_damaged:title_request_item_1') +
      data.requestTypeName +
      t('approved_lost_damaged:title_request_item_2') +
      data.requestID;
  }
  if (
    data.statusID === Commons.STATUS_REQUEST.APPROVED.value ||
    data.statusID === Commons.STATUS_REQUEST.DONE.value
  ) {
    statusIcon = Assets.iconApproved;
    colorText = 'colorGreen';
  } else if (data.statusID === Commons.STATUS_REQUEST.REJECT.value) {
    statusIcon = Assets.iconReject;
    colorText = 'colorRed';
  }
  return (
    <TouchableOpacity disabled={loading} onPress={handleRequestItem}>
      <Animated.View
        style={[
          cStyles.p10,
          cStyles.mb10,
          cStyles.rounded2,
          {backgroundColor: customColors.listItem},
        ]}
        renderToHardwareTextureAndroid>
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
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel label={'approved_lost_damaged:date_request'} />
                <CLabel
                  customLabel={moment(
                    data.requestDate,
                    DEFAULT_FORMAT_DATE_4,
                  ).format(formatDateView)}
                />
              </View>

              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_right]}>
                <CLabel label={'approved_lost_damaged:status_request'} />
                <CText
                  styles={'textMeta fontBold ' + colorText}
                  customLabel={data.statusName}
                />
              </View>
            </View>

            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel label={'approved_lost_damaged:region_request'} />
                <CLabel customLabel={data.regionName} />
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyStart,
                  styles.header_right,
                ]}>
                <CLabel label={'approved_lost_damaged:user_request'} />
                <CLabel medium customLabel={data.personRequest} />
              </View>
            </View>

            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
              <View
                style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
                <CLabel label={'approved_lost_damaged:department_request'} />
                <CLabel customLabel={data.deptName} />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

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

export default React.memo(RequestItem);

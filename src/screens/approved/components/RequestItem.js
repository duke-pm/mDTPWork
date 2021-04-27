/**
 ** Name: Request Item
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of RequestItem.js
 **/
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Routes from '~/navigation/Routes';
import { colors, cStyles } from '~/utils/style';
import Commons from '~/utils/common/Commons';
import Assets from '~/utils/asset/Assets';

function RequestItem(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  /** HANDLE FUNC */
  const handleRequestItem = (request) => {
    navigation.navigate(Routes.MAIN.ADD_APPROVED.name, {
      data: request,
    })
  };

  /** RENDER */
  const statusIcon = Assets.iconRequest;
  if (props.data.status === Commons.STATUS_REQUEST.APPROVED.code ||
    props.data.status === Commons.STATUS_REQUEST.DONE.code) {
    statusIcon = Assets.iconApproved;
  } else if (props.data.status === Commons.STATUS_REQUEST.REJECT.code) {
    statusIcon = Assets.iconReject;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={props.loading}
      onPress={handleRequestItem}
    >
      <View style={[cStyles.py10, props.index !== 0 && cStyles.borderTop]}>
        <View style={cStyles.flex1}>
          <View style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween
          ]}>
            <View style={[cStyles.row, cStyles.itemsStart, styles.header_left]}>
              <Image
                style={styles.icon_status}
                source={statusIcon}
                resizeMode={'contain'}
              />
              <CText
                styles={'textTitle pl10'}
                customLabel={t('approved:title_request_item') + props.data.requestID}
              />
            </View>

            <View style={[cStyles.itemsEnd, styles.header_right]}>

            </View>
          </View>

          <View style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
          ]}>
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pt10]}>
              <View>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText styles={'textMeta'} label={'approved:region_request'} />
                  <CText styles={'textMeta'} customLabel={props.data.regionName} />
                </View>

                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText styles={'textMeta'} label={'approved:user_request'} />
                  <CText styles={'textMeta'} customLabel={props.data.personRequest} />
                </View>

                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText styles={'textMeta'} label={'approved:department_request'} />
                  <CText styles={'textMeta'} customLabel={props.data.deptName} />
                </View>

                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText styles={'textMeta'} label={'approved:date_request'} />
                  <CText styles={'textMeta'} customLabel={props.data.requestDate} />
                </View>
              </View>

              {(props.data.status === Commons.STATUS_REQUEST.APPROVED.code ||
                props.data.status === Commons.STATUS_REQUEST.DONE.code) &&
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CText styles={'textMeta'} label={'approved:date_approved'} />
                  <CText styles={'textMeta'} customLabel={props.data.requestDate} />
                </View>
              }
            </View>
            <Feather name={'chevron-right'} color={colors.GRAY_500} size={18} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header_left: {
    flex: 0.7,
  },
  header_right: {
    flex: 0.3,
  },

  icon_status: {
    height: 20,
    width: 20,
  },
});

export default RequestItem;

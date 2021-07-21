/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Preocess of request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestProcess.js
 **/
import React, {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import CFooterList from '~/components/CFooterList';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

function RequestProcess(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {data = [], customColors = {}} = props;
  let isReject = false;

  /** Use state */
  const [anims, setAnims] = useState([]);

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let tmp = [],
      i = null;
    for (i of data) {
      if (i.personApproveName) {
        tmp.push(new Animated.Value(0));
      }
    }
    setAnims(tmp);
  }, []);

  useEffect(() => {
    if (anims.length > 0) {
      let tmp2 = [],
        i,
        t;
      for (i of anims) {
        t = Animated.timing(i, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        });
        tmp2.push(t);
      }

      Animated.sequence(tmp2).start();
    }
  }, [anims]);

  /************
   ** RENDER **
   ************/
  return anims.length > 0 ? (
    <View style={[cStyles.p16, cStyles.pb32]}>
      <CText
        styles={'textHeadline textCenter pb16'}
        label={'add_approved_assets:table_process'}
      />
      {data.map((item, index) => {
        if (!item.personApproveName) {
          return null;
        }
        if (!isReject && item.statusID === 0) {
          isReject = true;
        }
        return (
          <Animated.View
            key={index.toString()}
            style={[
              cStyles.row,
              cStyles.itemsStart,
              cStyles.pt10,
              {transform: [{scaleY: anims[index]}]},
            ]}>
            {item.approveDate ? (
              <View
                style={[
                  cStyles.rounded5,
                  cStyles.px10,
                  cStyles.py5,
                  cStyles.itemsCenter,
                  styles.con_time_process,
                ]}>
                <CText
                  styles={'textCaption1 fontMedium colorWhite'}
                  customLabel={item.approveDate}
                />
                <CText
                  styles={'textCaption1 fontMedium colorWhite'}
                  customLabel={item.approveTime}
                />
              </View>
            ) : (
              <View
                style={[
                  cStyles.rounded1,
                  cStyles.px10,
                  cStyles.py6,
                  cStyles.itemsCenter,
                  styles.con_date,
                ]}
              />
            )}

            <View style={[cStyles.px6, cStyles.itemsCenter, styles.con_icon]}>
              <Icon
                name={
                  !item.approveDate
                    ? Icons.alert
                    : item.statusID === 0
                    ? Icons.remove
                    : Icons.checkCircle
                }
                color={
                  !item.approveDate
                    ? customColors.orange
                    : item.statusID === 0
                    ? customColors.red
                    : customColors.green
                }
                size={moderateScale(21)}
              />
              {index !== data.length - 1 && (
                <View
                  style={[
                    cStyles.mt10,
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    isDark && cStyles.borderAllDark,
                    styles.line_2,
                  ]}
                />
              )}
            </View>

            <View style={[cStyles.rounded1, cStyles.pr10, styles.con_info]}>
              <View style={[cStyles.row, cStyles.itemsStart, styles.con_user]}>
                <CText
                  customStyles={[
                    cStyles.textCaption1,
                    isReject && !item.approveDate && cStyles.textThrough,
                    {color: customColors.text},
                  ]}
                  label={
                    'add_approved_lost_damaged:' +
                    (index === 0 ? 'user_request' : 'person_approved')
                  }
                />
                <CText
                  customStyles={[
                    cStyles.textCaption1,
                    item.approveDate && cStyles.fontBold,
                    isReject && !item.approveDate && cStyles.textThrough,
                    {color: customColors.text},
                  ]}
                  customLabel={item.personApproveName}
                />
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyStart,
                  cStyles.mt4,
                ]}>
                <CText
                  customStyles={[
                    cStyles.textCaption1,
                    isReject && !item.approveDate && cStyles.textThrough,
                    {color: customColors.text},
                  ]}
                  label={'add_approved_assets:status_approved'}
                />
                {item.approveDate ? (
                  <CText
                    customStyles={[
                      cStyles.textCaption1,
                      cStyles.fontBold,
                      isReject && !item.approveDate && cStyles.textThrough,
                      {color: customColors.text},
                    ]}
                    customLabel={item.statusName}
                  />
                ) : (
                  <CText
                    customStyles={[
                      cStyles.textCaption1,
                      isReject && !item.approveDate && cStyles.textThrough,
                      {color: customColors.text},
                    ]}
                    label={'add_approved_assets:wait'}
                  />
                )}
              </View>
              {item.approveDate && item.reason !== '' && (
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                    cStyles.mt4,
                    styles.con_reason,
                  ]}>
                  <CText
                    customStyles={[
                      cStyles.textCaption1,
                      isReject && !item.approveDate && cStyles.textThrough,
                      {color: customColors.text},
                    ]}
                    label={'add_approved_assets:reason_reject'}
                  />
                  <CText
                    customStyles={[
                      cStyles.textCaption1,
                      cStyles.fontBold,
                      isReject && !item.approveDate && cStyles.textThrough,
                      {color: customColors.text},
                    ]}
                    customLabel={item.reason}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        );
      })}
    </View>
  ) : (
    <CFooterList />
  );
}

const styles = StyleSheet.create({
  con_time_process: {backgroundColor: colors.SECONDARY, flex: 0.3},
  line_2: {height: moderateScale(20)},
  con_date: {flex: 0.3},
  con_icon: {flex: 0.1},
  con_info: {flex: 0.6},
  con_user: {width: '70%'},
  con_reason: {width: '80%'},
});

export default RequestProcess;

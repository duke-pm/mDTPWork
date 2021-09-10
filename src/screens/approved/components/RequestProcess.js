/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Preocess of request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RequestProcess.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, Animated} from 'react-native';
/* COMPONENTS */
import CIcon from '~/components/CIcon';
import CText from '~/components/CText';
import CFooterList from '~/components/CFooterList';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

/** All init */
let isReject = false;
let isLastProcess = false;

function RequestProcess(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {data = [], customColors = {}} = props;

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [anims, setAnims] = useState([]);
  const [dataProcess, setDataProcess] = useState([]);

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    let tmp = [],
      tmp2 = [],
      i = null;
    for (i of data) {
      if (i.personApproveID !== -1) {
        tmp.push(new Animated.Value(0));
        tmp2.push(i);
      }
    }
    setAnims(tmp);
    setDataProcess(tmp2);
    setLoading(false);
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
      {loading && (
        <View style={cStyles.flexCenter}>
          <CActivityIndicator />
        </View>
      )}
      {!loading &&
        dataProcess.map((item, index) => {
          isLastProcess = index === dataProcess.length - 1;
          if (!isReject && item.statusID === 0) {
            isReject = true;
          }
          return (
            <Animated.View
              key={index.toString()}
              style={[
                cStyles.row,
                cStyles.itemsStart,
                {transform: [{scaleY: anims[index]}]},
              ]}>
              {item.approveDate ? (
                <View
                  style={[
                    cStyles.rounded5,
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
                    cStyles.py6,
                    cStyles.itemsCenter,
                    styles.con_date,
                  ]}
                />
              )}

              <View
                style={[
                  cStyles.px6,
                  cStyles.pt10,
                  cStyles.itemsCenter,
                  styles.con_icon,
                ]}>
                <CIcon
                  name={
                    !item.approveDate
                      ? Icons.alert
                      : item.statusID === 0
                      ? Icons.remove
                      : Icons.checkCircle
                  }
                  customColor={
                    !item.approveDate
                      ? customColors.orange
                      : item.statusID === 0
                      ? customColors.red
                      : customColors.green
                  }
                  size={'medium'}
                />
                {index !== dataProcess.length - 1 && (
                  <View
                    style={[
                      cStyles.mt6,
                      cStyles.borderAll,
                      isDark && cStyles.borderAllDark,
                      styles.line,
                    ]}
                  />
                )}
              </View>

              <View
                style={[
                  cStyles.rounded1,
                  cStyles.pr10,
                  cStyles.pb10,
                  !isLastProcess && cStyles.borderBottom,
                  !isLastProcess && isDark && cStyles.borderBottomDark,
                  styles.con_info,
                ]}>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.pt10,
                    styles.con_user,
                  ]}>
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
  line: {height: moderateScale(30)},
  con_date: {flex: 0.3},
  con_icon: {flex: 0.1},
  con_info: {flex: 0.6},
  con_user: {width: '70%'},
  con_reason: {width: '80%'},
});

RequestProcess.propTypes = {
  data: PropTypes.array,
  customColors: PropTypes.object,
};

export default RequestProcess;

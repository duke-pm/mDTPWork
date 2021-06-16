/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Preocess of request
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of RequestProcess.js
 **/
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CCard from '~/components/CCard';
import CFooterList from '~/components/CFooterList';
/* COMMON */
import {Animations} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';

function RequestProcess(props) {
  const {data = [], customColors = {}, isDark = false} = props;
  let isReject = false;

  /** Use state */
  const [anims, setAnims] = useState([]);

  /** LIFE CYCLE */
  useEffect(() => {
    let tmp = [],
      item = null;
    for (item of data) {
      tmp.push(new Animated.Value(0));
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

  /** RENDER */
  return (
    <CCard
      containerStyle={[cStyles.m16, cStyles.mb32]}
      customColors={customColors}
      isDark={isDark}
      label={'add_approved_assets:table_process'}
      cardContent={
        anims.length > 0 ? (
          <View>
            {data.map((item, index) => {
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
                        cStyles.rounded1,
                        cStyles.px10,
                        cStyles.py6,
                        cStyles.itemsCenter,
                        styles.con_time_process,
                      ]}>
                      <CText
                        styles={'textMeta fontBold colorWhite'}
                        customLabel={item.approveDate}
                      />
                      <CText
                        styles={'textMeta fontBold colorWhite'}
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
                        {flex: 0.3},
                      ]}
                    />
                  )}

                  <View
                    style={[
                      cStyles.px10,
                      cStyles.pt6,
                      cStyles.itemsCenter,
                      {flex: 0.1},
                    ]}>
                    <LottieView
                      style={
                        item.statusID === 0
                          ? styles.img_icon_rejected
                          : !item.statusID
                          ? styles.img_warning
                          : styles.img_icon
                      }
                      source={
                        !item.approveDate
                          ? Animations.warning
                          : item.statusID === 0
                          ? Animations.rejected
                          : Animations.approved
                      }
                      autoPlay
                      loop={false}
                    />
                    {index !== data.length - 1 && (
                      <View
                        style={[
                          cStyles.mt10,
                          {backgroundColor: customColors.text},
                          styles.line_2,
                        ]}
                      />
                    )}
                  </View>

                  <View style={[cStyles.rounded1, cStyles.pr10, {flex: 0.6}]}>
                    <View
                      style={[cStyles.row, cStyles.itemsStart, {width: '70%'}]}>
                      <CText
                        customStyles={[
                          cStyles.textMeta,
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
                          cStyles.textMeta,
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
                      ]}>
                      <CText
                        customStyles={[
                          cStyles.textMeta,
                          isReject && !item.approveDate && cStyles.textThrough,
                          {color: customColors.text},
                        ]}
                        label={'add_approved_assets:status_approved'}
                      />
                      {item.approveDate ? (
                        <CText
                          customStyles={[
                            cStyles.textMeta,
                            cStyles.fontBold,
                            isReject &&
                              !item.approveDate &&
                              cStyles.textThrough,
                            {color: customColors.text},
                          ]}
                          customLabel={item.statusName}
                        />
                      ) : (
                        <CText
                          customStyles={[
                            cStyles.textMeta,
                            isReject &&
                              !item.approveDate &&
                              cStyles.textThrough,
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
                          {width: '80%'},
                        ]}>
                        <CText
                          customStyles={[
                            cStyles.textMeta,
                            isReject &&
                              !item.approveDate &&
                              cStyles.textThrough,
                            {color: customColors.text},
                          ]}
                          label={'add_approved_assets:reason_reject'}
                        />
                        <CText
                          customStyles={[
                            cStyles.textMeta,
                            cStyles.fontBold,
                            isReject &&
                              !item.approveDate &&
                              cStyles.textThrough,
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
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  con_time_process: {backgroundColor: colors.SECONDARY, flex: 0.3},
  line_2: {width: 2, height: 20},
  img_icon: {height: 42, width: 42},
  img_icon_rejected: {height: 23, width: 23},
  img_warning: {height: 26, width: 26},
});

export default RequestProcess;

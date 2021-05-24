/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Preocess of request
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of RequestProcess.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CText from '~/components/CText';
import CCard from '~/components/CCard';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';

function RequestProcess(props) {
  const {data = [], customColors = {}, isDark = false} = props;
  let isReject = false;

  return (
    <CCard
      containerStyle={cStyles.m16}
      customColors={customColors}
      isDark={isDark}
      label={'add_approved_assets:table_process'}
      cardContent={
        <View>
          {data.map((item, index) => {
            if (!isReject && item.statusID === 0) {
              isReject = true;
            }
            return (
              <View
                key={index.toString()}
                style={[cStyles.row, cStyles.itemsStart, cStyles.pt10]}>
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
                  <Icon
                    name={
                      !item.approveDate
                        ? 'help-circle'
                        : item.statusID === 0
                        ? 'x-circle'
                        : 'check-circle'
                    }
                    size={scalePx(3)}
                    color={
                      !item.approveDate
                        ? customColors.orange
                        : item.statusID === 0
                        ? customColors.red
                        : customColors.green
                    }
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
                          isReject && !item.approveDate && cStyles.textThrough,
                          {color: customColors.text},
                        ]}
                        customLabel={item.statusName}
                      />
                    ) : (
                      <CText
                        customStyles={[
                          cStyles.textMeta,
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
                        {width: '80%'},
                      ]}>
                      <CText
                        customStyles={[
                          cStyles.textMeta,
                          isReject && !item.approveDate && cStyles.textThrough,
                          {color: customColors.text},
                        ]}
                        label={'add_approved_assets:reason_reject'}
                      />
                      <CText
                        customStyles={[
                          cStyles.textMeta,
                          cStyles.fontBold,
                          isReject && !item.approveDate && cStyles.textThrough,
                          {color: customColors.text},
                        ]}
                        customLabel={item.reason}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_time_process: {backgroundColor: colors.SECONDARY, flex: 0.3},
  line_2: {width: 2, height: 20},
});

export default RequestProcess;

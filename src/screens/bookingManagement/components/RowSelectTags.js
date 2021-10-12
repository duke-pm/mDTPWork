/**
 ** Name: Row select tags
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RowSelectTags.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CActivityIndicator from '~/components/CActivityIndicator';
import CAvatar from '~/components/CAvatar';
import CIcon from '~/components/CIcon';
import CIconButton from '~/components/CIconButton';
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
/* COMMON */
import {Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';

function RowSelectTags(props) {
  const {
    loading = false,
    disabled = false,
    isDark = false,
    dataActive = [],
    onPress = () => null,
    onPressRemove = () => null,
    onPressItem = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.p4,
        cStyles.mt10,
        cStyles.borderDashed,
        cStyles.rounded1,
        cStyles.borderAll,
        isDark && cStyles.borderAllDark,
      ]}>
      {!loading ? (
        <View style={[cStyles.flexWrap, cStyles.itemsCenter, cStyles.row]}>
          {dataActive.length > 0 &&
            dataActive.map((item, index) => {
              return (
                <CTouchable onPress={() => onPressItem(item, true)}>
                  <View
                    key={item.empID + index}
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      cStyles.justifyBetween,
                      cStyles.rounded1,
                      cStyles.pl4,
                      cStyles.mr4,
                      cStyles.mt4,
                      disabled && cStyles.py6,
                      disabled && cStyles.px8,
                      {backgroundColor: colors.STATUS_SCHEDULE_OPACITY},
                    ]}>
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <CAvatar size={'vsmall'} label={item.empName} />
                      <CText
                        styles={'textCaption1 fontRegular pl6'}
                        customLabel={item.empName}
                      />
                    </View>

                    {!disabled && (
                      <CIconButton
                        iconName={Icons.remove}
                        iconColor={'red'}
                        disabled={disabled}
                        onPress={() => onPressRemove(item.empID)}
                      />
                    )}
                  </View>
                </CTouchable>
              );
            })}
          {dataActive.length > 0 && !disabled && (
            <CTouchable
              containerStyle={cStyles.mt4}
              onPress={onPress}
              disabled={disabled}>
              <View
                style={[
                  cStyles.center,
                  cStyles.rounded1,
                  {backgroundColor: colors.STATUS_SCHEDULE_OPACITY},
                ]}>
                <CIconButton
                  iconName={Icons.addNew}
                  iconColor={'green'}
                  disabled
                />
              </View>
            </CTouchable>
          )}

          {dataActive.length === 0 && (
            <CTouchable
              containerStyle={cStyles.mt10}
              onPress={onPress}
              disabled={disabled}>
              <View style={cStyles.py3}>
                {!disabled ? (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <CIcon
                      name={Icons.addUser}
                      size={'smaller'}
                      color={'green'}
                    />
                    <CText
                      styles={
                        'textCaption1 colorGreen textItalic textUnderline pl6'
                      }
                      label={'add_booking:no_participants'}
                    />
                  </View>
                ) : (
                  <CText
                    styles={'textCaption1'}
                    label={'add_booking:holder_no_participants'}
                  />
                )}
              </View>
            </CTouchable>
          )}
        </View>
      ) : (
        <CActivityIndicator />
      )}
    </View>
  );
}

RowSelectTags.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  isDark: PropTypes.bool,
  dataActive: PropTypes.array,
  onPress: PropTypes.func,
  onPressRemove: PropTypes.func,
  onPressItem: PropTypes.func,
};

export default RowSelectTags;

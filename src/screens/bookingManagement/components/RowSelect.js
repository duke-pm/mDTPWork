/**
 ** Name: Row select
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of RowSelect.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';
/* COMPONENTS */
import CIcon from '~/components/CIcon';
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import {Icons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {
  checkEmpty,
  IS_ANDROID,
  moderateScale,
  verticalScale,
} from '~/utils/helper';

function RowSelect(props) {
  const {
    loading = false,
    disabled = false,
    isDark = false,
    customColors = {},
    data = [],
    activeIndex = -1,
    error = false,
    errorHelper = undefined,
    keyToShow = undefined,
    keyToCompare = undefined,
    onPress = () => null,
  } = props;

  let findRow = null;
  if (data && data.length > 0) {
    if (keyToCompare) {
      findRow = data.find(f => f[keyToCompare] === activeIndex);
    } else {
      findRow = data.find(f => f === activeIndex);
    }
  }

  /************
   ** RENDER **
   ************/
  return (
    <>
      <CTouchable
        containerStyle={cStyles.mt6}
        disabled={disabled}
        onPress={onPress}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.px10,
            cStyles.rounded1,
            cStyles.borderAll,
            isDark && cStyles.borderAllDark,
            disabled && {backgroundColor: customColors.cardDisable},
            error && {borderColor: customColors.red},
            styles.row_select,
          ]}>
          {!loading && findRow ? (
            keyToShow ? (
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <View
                  style={[
                    styles.color_resource,
                    {backgroundColor: findRow.colorName},
                  ]}
                />
                <CText
                  styles={'pl10'}
                  customLabel={findRow ? checkEmpty(findRow[keyToShow]) : '-'}
                />
              </View>
            ) : (
              <CText customLabel={findRow ? checkEmpty(findRow) : '-'} />
            )
          ) : (
            <CActivityIndicator />
          )}
          {!disabled && (
            <CIcon
              name={Icons.down}
              size={'medium'}
              customColor={
                disabled ? customColors.textDisable : customColors.icon
              }
            />
          )}
        </View>
      </CTouchable>
      {error && errorHelper && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pt6]}>
          <CIcon name={Icons.alert} size={'smaller'} color={'red'} />
          <CText
            customStyles={[
              cStyles.pl6,
              cStyles.textCaption1,
              cStyles.fontRegular,
              {color: customColors.red},
            ]}
            label={errorHelper}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row_select: {
    height: IS_ANDROID
      ? verticalScale(38)
      : ifIphoneX(verticalScale(30), verticalScale(36)),
  },
  color_resource: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: 4,
  },
});

RowSelect.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  isDark: PropTypes.bool,
  customColors: PropTypes.customColors,
  data: PropTypes.array,
  activeIndex: PropTypes.number,
  error: PropTypes.bool,
  errorHelper: PropTypes.any,
  keyToShow: PropTypes.any,
  keyToCompare: PropTypes.any,
  onPress: PropTypes.func,
};

export default RowSelect;

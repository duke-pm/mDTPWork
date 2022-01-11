/**
 ** Name: Custom Item SubMenu
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CItem.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {Button, Text} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
/** COMMON */
import {colors, cStyles} from "~/utils/style";
import {
  sW,
  moderateScale,
} from "~/utils/helper";

const sizeIcon = moderateScale(32);
const GRADIENT = {
  START: {x: 0.0, y: 0.25},
  END: {x: 0.5, y: 1.0},
};

function CItem(props) {
  const {
    iconStyle = {},
    index = 0,
    data = null,
    bgColor = [],
    onPress = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = () => onPress(data, index);

  /**************
   ** RENDER **
   **************/
  if (!data) return null;
  return (
    <Button
      appearance="ghost"
      status="basic"
      onPress={handleItem}>
      {propsB => (
        <View style={[cStyles.itemsCenter, cStyles.py10]}>
          <View
            style={[
              cStyles.rounded1,
              cStyles.center,
              {backgroundColor: bgColor},
              styles.con_icon,
            ]}>
            <LinearGradient
              style={[
                cStyles.center,
                cStyles.rounded5,
                cStyles.p8,
                iconStyle,
              ]}
              start={GRADIENT.START}
              end={GRADIENT.END}
              colors={props.colors}>
              <Icon
                name={data.mIcon}
                color={colors.WHITE}
                size={sizeIcon}
              />
            </LinearGradient>
          </View>

          <Text style={cStyles.mt10} category="s1">
            {data.menuName}
          </Text>
        </View>
      )}
    </Button>
  );
}

const styles = StyleSheet.create({
  item: {width: sW("30%")},
  con_icon: {
    height: moderateScale(70),
    width: moderateScale(70),
  },
});

CItem.propTypes = {
  iconStyle: PropTypes.object,
  index: PropTypes.number,
  data: PropTypes.object,
  bgColor: PropTypes.string,
  onPress: PropTypes.func,
};

export default React.memo(CItem);

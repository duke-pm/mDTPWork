/**
 ** Name: ListItem
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ListItem.js
 **/
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Rate, {AndroidMarket} from 'react-native-rate';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Configs from '~/config';
import {scalePx} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

function ListItem(props) {
  const navigation = useNavigation();
  const {index, data, dataLength, onPressSignOut} = props;

  /** HANDLE FUNC */
  const handleItem = () => {
    if (data.isPhone) {
      Linking.openURL(`tel:${data.value}`);
    } else if (data.nextRoute) {
      navigation.navigate(data.nextRoute);
    } else if (data.isSignOut) {
      onPressSignOut();
    } else if (data.isURL) {
      Linking.openURL(data.value);
    } else if (data.isRate) {
      const options = {
        AppleAppID: Configs.appStoreID,
        GooglePackageName: Configs.googlePlayPackage,
        preferredAndroidMarket: AndroidMarket.Google,
        preferInApp: false,
        openAppStoreIfInAppFails: true,
      };
      Rate.rate(options, success => {
        if (success) {
          console.log('[LOG] === SUCCESS RATE ===> ', success);
        }
      });
    }
  };

  /** RENDER */
  const Component =
    data.nextRoute ||
    data.isSignOut ||
    data.isPhone ||
    data.isURL ||
    data.isRate
      ? TouchableWithoutFeedback
      : View;

  return (
    <Component key={data.id} onPress={handleItem}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.py16,
          index !== dataLength - 1 && styles.line_bottom,
        ]}>
        <View style={[cStyles.row, cStyles.itemsCenter, styles.con_left]}>
          <Icon name={data.icon} size={scalePx(3)} color={colors.ICON_META} />
          <CText styles={'pl16'} label={data.label} />
        </View>

        <View style={[cStyles.itemsEnd, styles.con_right]}>
          {(data.nextRoute || data.isURL) && (
            <Icon
              name={'chevron-right'}
              size={scalePx(3)}
              color={colors.ICON_BASE}
            />
          )}
          {data.value && data.isPhone && (
            <CText styles={'colorTextMeta'} label={data.value} />
          )}
        </View>
      </View>
    </Component>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.6},
  con_right: {flex: 0.4},
  line_bottom: {
    borderBottomColor: colors.BORDER_COLOR,
    borderBottomWidth: 1.5,
  },
});

export default ListItem;

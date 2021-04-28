/**
 ** Name: CHeader
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CHeader.js
 **/
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CText from './CText';
import CInput from './CInput';
/** COMMON */
import { cStyles, colors } from '~/utils/style';
import { IS_ANDROID } from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CHeader(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    background = colors.PRIMARY,
    hasBack = false,
    hasMenu = false,
    hasSearch = false,
    hasAddNew = false,
    title = '',
    subTitle = null,
    left = null,
    right = null,

    onPressAddNew = () => { },
    onPressSearch = () => { },
  } = props;

  const [isSearch, setIsSearch] = useState(false);

  /** HANDLE FUNC */
  const handleBack = () => {
    navigation.goBack();
  };

  const handleToogleSearch = (show) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearch(show);
  };

  const handleAddNew = () => {
    onPressAddNew();
  };

  const handleSearch = (value) => {
    onPressSearch(value);
  };

  /** RENDER */
  return (
    <View style={[
      styles.container,
      cStyles.shadowHeader,
      isSearch && cStyles.px16,
      { backgroundColor: background }
    ]}>
      {isSearch &&
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pb10]}>
          <CText
            styles={'colorWhite pr16 pt6'}
            label={'common:close'}
            onPress={() => handleToogleSearch(false)} />

          <CInput
            containerStyle={styles.input_search}
            style={styles.con_search}
            iconLastStyle={styles.con_search}
            iconLast={'search'}
            iconLastColor={colors.GRAY_600}
            holder={'approved:search_request'}
            autoFocus
            returnKey={'search'}
            onChangeInput={handleSearch}
            onPressIconLast={handleSearch}
          />
        </View>
      }

      {!isSearch &&
        <>
          <View
            style={[
              cStyles.row,
              cStyles.justifystart,
              cStyles.itemsCenter,
              styles.con_left
            ]}>
            {hasBack &&
              <TouchableOpacity
                style={cStyles.itemsStart}
                activeOpacity={0.5}
                onPress={handleBack}
              >
                <Feather
                  style={cStyles.p16}
                  name={'chevron-left'}
                  color={colors.WHITE}
                  size={25}
                />
              </TouchableOpacity>
            }

            {hasMenu &&
              <TouchableOpacity
                style={cStyles.itemsStart}
                activeOpacity={0.5}
                onPress={handleBack}
              >
                <Icon
                  style={cStyles.p16}
                  name={'bars'}
                  color={colors.WHITE}
                  size={20}

                />
              </TouchableOpacity>
            }
            {left && left}
          </View>

          <View style={[styles.con_body, cStyles.center]}>
            <CText styles={'H6 colorWhite'} label={t(title)} />
            {subTitle &&
              <CText styles={'textMeta colorWhite'} label={t(subTitle)} />
            }
          </View>

          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.justifyEnd,
              cStyles.itemsCenter,
              styles.con_right
            ]}>
            {hasSearch &&
              <TouchableOpacity
                style={cStyles.itemsEnd}
                activeOpacity={0.5}
                onPress={() => handleToogleSearch(true)}
              >
                <Icon
                  style={cStyles.p16}
                  name={'search'}
                  color={colors.WHITE}
                  size={20}
                />
              </TouchableOpacity>
            }

            {hasAddNew &&
              <TouchableOpacity
                style={cStyles.itemsEnd}
                activeOpacity={0.5}
                onPress={handleAddNew}
              >
                <Icon
                  style={cStyles.p16}
                  name={'plus'}
                  color={colors.WHITE}
                  size={20}
                />
              </TouchableOpacity>
            }

            {right && right}
          </View>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    borderBottomColor: cStyles.toolbarDefaultBorder,
    top: 0,
    left: 0,
    right: 0
  },
  con_left: {
    flex: 0.2,
  },
  con_body: {
    flex: 0.6,
  },
  con_right: {
    flex: 0.2,
  },
  input_search: { width: '85%' },
  con_search: { backgroundColor: colors.WHITE },
});

export default CHeader;

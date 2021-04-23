/**
 ** Name: CHeader
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CHeader.js
 **/
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CText from './CText';
/** COMMON */
import { cStyles, colors } from '~/utils/style';

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

    onPressAddNew = () => { }
  } = props;


  /** HANDLE FUNC */
  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {

  };

  const handleAddNew = () => {
    onPressAddNew();
  };

  /** RENDER */
  return (
    <View
      style={[styles.container, cStyles.shadowHeader, { backgroundColor: background }]}>
      <View style={[
        cStyles.flex1,
        cStyles.justifyCenter,
        styles.con_left
      ]}>
        {hasBack &&
          <TouchableOpacity
            style={cStyles.itemsStart}
            activeOpacity={0.5}
            onPress={handleBack}
          >
            <Icon
              style={cStyles.p16}
              name={'chevron-left'}
              color={colors.WHITE}
              size={20}

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
          cStyles.justifyCenter,
          styles.con_right
        ]}>
        {hasSearch &&
          <TouchableOpacity
            style={cStyles.itemsEnd}
            activeOpacity={0.5}
            onPress={handleSearch}
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
});

export default CHeader;

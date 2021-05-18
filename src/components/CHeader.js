/**
 ** Name: CHeader
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CHeader.js
 **/
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/** COMPONENTS */
import CText from './CText';
import CInput from './CInput';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {IS_ANDROID, scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CHeader(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const {customColors} = useTheme();

  const {
    hasBack = false,
    hasMenu = false,
    hasSearch = false,
    hasAddNew = false,
    title = '',
    subTitle = null,
    left = null,
    right = null,
    iconBack = null,

    onPressAddNew = () => {},
    onPressSearch = () => {},
  } = props;

  const dispatch = useDispatch();

  const [isSearch, setIsSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState('');

  /** HANDLE FUNC */
  const handleBack = () => {
    navigation.goBack();
  };

  const handleToogleSearch = show => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearch(show);
    dispatch(Actions.changeIsSearch(show));
  };

  const handleAddNew = () => {
    onPressAddNew();
  };

  const handleSearch = () => {
    onPressSearch(valueSearch);
    handleToogleSearch(false);
  };

  const handleChangeValue = value => {
    setValueSearch(value);
  };

  /** RENDER */
  return (
    <View
      style={[
        cStyles.shadowHeader,
        styles.container,
        {backgroundColor: isDark ? customColors.header : customColors.primary},
        isSearch && cStyles.px16,
      ]}>
      {isSearch && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pb6]}>
          <CInput
            containerStyle={styles.input_search}
            iconLast={'search'}
            iconLastColor={colors.GRAY_700}
            valueColor={customColors.text}
            holder={'approved_assets:search_request'}
            autoFocus
            returnKey={'search'}
            value={valueSearch}
            onChangeValue={handleChangeValue}
            onChangeInput={handleSearch}
            onPressIconLast={handleSearch}
          />
          <CText
            styles={'colorWhite pl16 pt6'}
            label={'common:close'}
            onPress={() => handleToogleSearch(false)}
          />
        </View>
      )}

      {!isSearch && (
        <>
          <View
            style={[
              cStyles.row,
              cStyles.justifystart,
              cStyles.itemsCenter,
              styles.con_left,
            ]}>
            {hasBack && (
              <TouchableOpacity style={cStyles.itemsStart} onPress={handleBack}>
                <Icon
                  style={cStyles.p16}
                  name={
                    iconBack || (IS_ANDROID ? 'arrow-left' : 'chevron-left')
                  }
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {hasMenu && (
              <TouchableOpacity style={cStyles.itemsStart} onPress={handleBack}>
                <Icon
                  style={cStyles.p16}
                  name={'menu'}
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}
            {left && left}
          </View>

          <View
            style={[
              styles.con_body,
              IS_ANDROID && (hasBack || hasMenu || left)
                ? cStyles.justifyCenter
                : cStyles.center,
            ]}>
            <CText
              customStyles={[cStyles.H6, cStyles.colorWhite]}
              label={t(title)}
            />
            {subTitle && (
              <CText customStyles={cStyles.textMeta} label={t(subTitle)} />
            )}
          </View>

          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.justifyEnd,
              cStyles.itemsCenter,
              styles.con_right,
            ]}>
            {hasSearch && (
              <TouchableOpacity
                style={cStyles.itemsEnd}
                onPress={() => handleToogleSearch(true)}>
                <Icon
                  style={cStyles.p16}
                  name={'search'}
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {hasAddNew && (
              <TouchableOpacity style={cStyles.itemsEnd} onPress={handleAddNew}>
                <Icon
                  style={cStyles.p16}
                  name={'file-plus'}
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {right && right}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  con_left: {flex: 0.2},
  con_body: {flex: 0.6},
  con_right: {flex: 0.2},
  input_search: {width: '85%'},
  con_search: {backgroundColor: 'white'},
});

export default CHeader;

/**
 ** Name:CSearchBar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CSearchBar.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {LayoutAnimation, UIManager, Platform, View} from 'react-native';
import SearchBar from 'react-native-platform-searchbar';
/** COMPONENTS */
import CIconButton from './CIconButton';
import CActivityIndicator from './CActivityIndicator';
/* COMMON */
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import Icons from '~/config/Icons';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CSearchBar(props) {
  const {t} = useTranslation();
  const theme = useColorScheme();
  const {
    containerStyle = {},
    style = {},
    loading = false,
    isVisible = false,
    valueSearch = '',
    onSearch = () => null,
    onClose = () => null,
  } = props;

  /** Use state */
  const [value, setValue] = useState(valueSearch);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = () => {
    onSearch(value);
  };

  const handleClearInput = () => {
    setValue('');
  };

  const handleCancelInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onClose();
  };

  /**********
   ** FUNC **
   **********/
  const onChangeText = valueInput => {
    setValue(valueInput);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    setValue(valueSearch);
  }, [valueSearch]);

  /************
   ** RENDER **
   ************/
  if (!isVisible) {
    return null;
  }
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
        cStyles.my10,
        IS_ANDROID && cStyles.mr40,
        containerStyle,
      ]}>
      {IS_ANDROID && (
        <CIconButton
          style={cStyles.pl12}
          disabled={loading}
          iconName={Icons.backAndroid}
          iconColor={theme === 'dark' ? colors.GRAY_300 : colors.GRAY_700}
          iconProps={{size: moderateScale(23)}}
          onPress={handleCancelInput}
        />
      )}
      <SearchBar
        style={[cStyles.mx16, style]}
        platform={Platform.OS}
        theme={theme}
        iconColor={theme === 'dark' ? colors.GRAY_300 : colors.GRAY_700}
        leftIcon={IS_ANDROID ? () => <View /> : undefined}
        cancelText={t('common:cancel')}
        placeholder={t('common:holder_search')}
        value={value}
        autoFocus={true}
        keyboardType={'default'}
        returnKeyType={'search'}
        returnKeyLabel={t('common:find')}
        onSubmitEditing={handleSearch}
        onChangeText={onChangeText}
        onCancel={handleCancelInput}
        onClear={handleClearInput}>
        {loading ? <CActivityIndicator style={cStyles.mr10} /> : undefined}
      </SearchBar>
    </View>
  );
}

export default CSearchBar;

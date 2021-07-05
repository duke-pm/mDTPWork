/**
 ** Name:CSearchBar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CSearchBar.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {LayoutAnimation, UIManager} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchBar from 'react-native-searchbar';
/* COMMON */
import {fS, IS_ANDROID, IS_IOS} from '~/utils/helper';
import {cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

let searchBarRef = createRef();

function CSearchBar(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {isVisible, onSearch, onClose} = props;

  /** Use state */
  const [value, setValue] = useState('');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleSearch = () => {
    onSearch(value);
    handleCloseSearch();
  };

  const handleCloseSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onClose();
  };

  /************
   ** FUNC **
   ************/
  const onChangeSearch = valueInput => {
    setValue(valueInput);
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    if (isVisible) {
      searchBarRef.show();
    } else {
      searchBarRef.hide();
    }
  }, [isVisible]);

  /**************
   ** RENDER **
   **************/
  return (
    <SearchBar
      ref={ref => (searchBarRef = ref)}
      placeholder={t('common:holder_search')}
      backgroundColor={customColors.background}
      textColor={customColors.text}
      selectionColor={customColors.text}
      iOSPadding={true}
      iOSHideShadow={true}
      clearOnHide={false}
      autoCorrect={false}
      autoCapitalize={'none'}
      fontSize={cStyles.textDefault.fontSize}
      heightAdjust={IS_IOS ? -20 : 0}
      backButton={
        <Icon
          name={IS_IOS ? 'chevron-back-outline' : 'arrow-back-outline'}
          size={fS(22)}
          color={customColors.text}
        />
      }
      closeButton={
        IS_IOS && value !== '' ? (
          <Icon
            name={IS_IOS ? 'close-circle' : 'close'}
            size={20}
            color={customColors.textDisable}
          />
        ) : undefined
      }
      handleChangeText={onChangeSearch}
      onSubmitEditing={handleSearch}
      onBack={handleCloseSearch}
    />
  );
}

export default CSearchBar;

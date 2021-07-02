/**
 ** Name:CSearchBar
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CSearchBar.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {LayoutAnimation, UIManager} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
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
      iOSPadding={false}
      iOSHideShadow={true}
      clearOnHide={false}
      autoCorrect={false}
      autoCapitalize={'none'}
      fontFamily={cStyles.textDefault.fontFamily}
      fontSize={cStyles.textDefault.fontSize}
      backButton={
        <Icon
          style={IS_IOS ? cStyles.pt2 : {}}
          name={IS_ANDROID ? 'arrow-left' : 'chevron-left'}
          size={IS_IOS ? fS(30) : fS(23)}
          color={customColors.icon}
        />
      }
      handleChangeText={onChangeSearch}
      onSubmitEditing={handleSearch}
      onBack={handleCloseSearch}
    />
  );
}

export default CSearchBar;

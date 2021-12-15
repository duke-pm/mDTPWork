/**
 ** Name: Custom search bar
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CSearchBar.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Input, Button, Icon, Spinner} from '@ui-kitten/components';
import {Platform, View} from 'react-native';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';

/** All init */
const ICON = {
  CLOSE: {
    ios: 'close-circle',
    android: 'close',
  }
};
const HEIGHT = moderateScale(33);

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderSearchIcon = props => {
  return (
    <Icon {...props} name={'search'} />
  );
}

const RenderRemoveIcon = props => {
  return (
    <Icon {...props} name={ICON.CLOSE[Platform.OS]} />
  );
}

const RenderLeftIcon = (props, loading, handleSearch) => {
  if (loading) {
    return (
      <View style={[props.style, cStyles.center, {height: HEIGHT, width: HEIGHT}]}>
        <Spinner size={'tiny'} />
      </View>
    )
  }
  return (
    <Button
      size={'small'}
      appearance={'ghost'}
      accessoryLeft={RenderSearchIcon}
      onPress={handleSearch}
    />
  )
}

const RenderRightIcon = (loading, handleRemove) => {
  if (loading) return null;
  return (
    <Button
      size={'small'}
      appearance={'ghost'}
      accessoryLeft={RenderRemoveIcon}
      status={'danger'}
      onPress={handleRemove}
    />
  )
}

/********************
 ** MAIN COMPONENT **
 ********************/
function CSearchBar(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const {
    autoFocus = false,
    onSearch = () => null,
    onCallbackSearch = () => null,
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleRemove = () => setValue('');

  const handleSearch = () => {
    setLoading(true);
    onSearch(value);
    setTimeout(() => {
      setLoading(false);
      onCallbackSearch();
    }, 2000);
  };

  /**********
   ** FUNC **
   **********/
  const onChangeValue = newValue => setValue(newValue);

  /************
   ** RENDER **
   ************/
  return (
      <Input
        disabled={loading}
        value={value}
        keyboardAppearance={themeContext.themeApp}
        placeholder={t('common:write_something_to_search')}
        returnKeyType={'search'}
        autoFocus={autoFocus}
        accessoryLeft={propsLeft => RenderLeftIcon(propsLeft, loading, value !== ''  ? handleSearch : null)}
        accessoryRight={value !== '' 
          ? () => RenderRightIcon(loading, handleRemove)
          : undefined
        }
        onChangeText={onChangeValue}
        onSubmitEditing={handleSearch}
      />
  );
}

CSearchBar.propTypes = {
  autoFocus: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
  onCallbackSearch: PropTypes.func.isRequired,
};

export default CSearchBar;

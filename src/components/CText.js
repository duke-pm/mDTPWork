/**
 ** Name: Custom Text
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CText.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Text, Icon} from '@ui-kitten/components';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/** COMMON */
import {cStyles} from '~/utils/style';
import {LIGHT} from '~/configs/constants';
import {ThemeContext} from '~/configs/theme-context';

const COLORS = {
  BG_SHOW_LIGHT: [
    'rgba(255,255,255,0)',
    'rgba(255,255,255,0.08)',
    'rgba(255,255,255,0.8)',
    'rgba(255,255,255,1)'],
  BG_SHOW_DARK: [
    'rgba(0,0,0,0)',
    'rgba(34,43,69,0.08)',
    'rgba(34,43,69,0.8)',
    'rgba(34,43,69,1)',
  ],
  BG_LESS: ['transparent']
}

/*********************
 ** OTHER COMPONENT **
 *********************/
const RanderShowMoreIcon = props => (
  <Icon {...props} name={'arrowhead-down-outline'} />
);

const RanderShowLessIcon = props => (
  <Icon {...props} name={'arrowhead-up-outline'} />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function CText(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const {
    style = {},
    category = 'p1',
    maxLines = 5,
  } = props;
  let lineHeight = 0;
  if (category === 'h1') {
    lineHeight = 34;
  } else if (category === 'h2') {
    lineHeight = 32;
  } else if (category === 'h3') {
    lineHeight = 30;
  } else if (category === 'h4') {
    lineHeight = 28;
  } else if (category === 'h5') {
    lineHeight = 26;
  } else if (category === 'h6') {
    lineHeight = 24;
  } else if (category === 's1') {
    lineHeight = 22;
  } else if (category === 's2') {
    lineHeight = 21;
  } else if (category === 'p1') {
    lineHeight = 20;
  } else if (category === 'p2') {
    lineHeight = 19;
  } else if (category === 'c1') {
    lineHeight = 17;
  } else if (category === 'c2') {
    lineHeight = 15;
  } else if (category === "s1") {
    lineHeight = 20;
  }

  /** Use state */
  const [hasShowMore, setHasShowMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [maxL, setMaxL] = useState(maxLines);

  const handleShowMore = () => {
    if (!showMore) setMaxL(maxLines);
    else setMaxL(0);
    setShowMore(!showMore);
  };

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    const maxHeight = maxL * lineHeight;
    if (maxL > 0 && height > maxHeight) {
      setShowMore(true);
      setHasShowMore(true);
    }
  };

  /************
   ** RENDER **
   ************/
  return (
    <View>
      <Text {...props}
        style={[style, {lineHeight}]}
        numberOfLines={props.numberOfLines || (showMore ? maxLines : 0)}
        onLayout={onLayout}>
        {props.children}
      </Text>
      {showMore && hasShowMore && (
        <LinearGradient
          colors={showMore
            ? themeContext.themeApp === LIGHT
              ? COLORS.BG_SHOW_LIGHT
              :  COLORS.BG_SHOW_DARK
            : COLORS.BG_LESS}
          style={[
            cStyles.justifyEnd,
            cStyles.abs,
            cStyles.fullWidth,
            cStyles.fullHeight,
          ]}>
          <Button
            appearance="ghost"
            size="small"
            accessoryRight={showMore
              ? RanderShowMoreIcon
              : RanderShowLessIcon}
            onPress={handleShowMore}>
            {evaProps => (
              <Text category="c1" status="primary">
                {t('common:show_more')}
              </Text>
            )}
          </Button>
        </LinearGradient>
      )}
    </View>
  );
}

CText.propTypes = {
  style: PropTypes.object,
  category: PropTypes.string,
  maxLines: PropTypes.number,
}

export default CText;

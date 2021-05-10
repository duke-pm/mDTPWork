/**
 ** Name: CCard
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of CCard.js
 **/
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import { colors, cStyles } from '~/utils/style';

const CCard = React.memo(function CCard(props) {
  const {
    containerStyle = {},
    contentLabelStyle = {},
    label = null,
    cardHeader = null,
    cardContent = null,
    cardFooter = null,
  } = props;

  return (
    <View style={[
      cStyles.rounded2,
      cStyles.shadow1,
      cStyles.mt32,
      styles.container,
      containerStyle,
    ]}>
      {label &&
        <View style={[
          cStyles.rounded1,
          cStyles.px10,
          cStyles.py3,
          cStyles.borderAll,
          cStyles.ml10,
          styles.con_label,
          contentLabelStyle,
        ]}>
          <CText styles={'textTitle'} label={label} />
        </View>
      }

      {cardHeader &&
        <View style={[cStyles.pt24, cStyles.px16]}>
          {cardHeader}
        </View>
      }

      {cardContent &&
        <View style={[cStyles.py10, cStyles.px16]}>
          {cardContent}
        </View>
      }

      {cardFooter &&
        <View style={[cStyles.py10, cStyles.px16]}>
          {cardFooter}
        </View>
      }
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BACKGROUND_CARD,
  },
  con_label: {
    backgroundColor: colors.WHITE,
    position: 'absolute',
    top: -15,
  },
});

export default CCard;

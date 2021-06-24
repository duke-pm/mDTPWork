/**
 ** Name: CCheckbox
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CCheckbox.js
 **/
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CText from '~/components/CText';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';

let handleRef = createRef();

function CCheckbox(props) {
  const {t} = useTranslation();
  const {
    containerStyle,
    labelLeft,
    labelRight,
    disabled,
    value,
    onChange,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleCheck = () => {
    handleRef.pulse(300);
    onChange();
  };

  /**************
   ** RENDER **
   **************/
  return (
    <TouchableOpacity disabled={disabled} onPress={handleCheck}>
      <Animatable.View
        ref={ref => (handleRef = ref)}
        useNativeDriver={true}
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyStart,
          cStyles.py16,
          containerStyle,
        ]}>
        {labelLeft && (
          <CText
            customStyles={[
              cStyles.textDefault,
              cStyles.pl10,
              cStyles.colorWhite,
            ]}
            label={t(labelLeft)}
          />
        )}

        <Icon
          name={value ? 'check-circle' : 'circle'}
          size={scalePx(3)}
          color={value ? colors.SECONDARY : colors.GRAY_500}
        />

        {labelRight && (
          <CText
            customStyles={[
              cStyles.textDefault,
              cStyles.pl10,
              cStyles.colorWhite,
            ]}
            label={t(labelRight)}
          />
        )}
      </Animatable.View>
    </TouchableOpacity>
  );
}

export default CCheckbox;

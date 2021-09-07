/**
 ** Name: CCheckbox
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CCheckbox.js
 **/
import PropTypes from 'prop-types';
import React, {createRef} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
/** COMPONENTS */
import CText from '~/components/CText';
import CIcon from './CIcon';
/** COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';

/** All refs on check box */
let handleRef = createRef();

function CCheckbox(props) {
  const {t} = useTranslation();
  const {
    containerStyle = {},
    textStyle = {},
    labelLeft = undefined,
    labelRight = undefined,
    disabled = false,
    value = true,
    onChange = () => null,
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleCheck = () => {
    handleRef.pulse(300);
    onChange();
  };

  /************
   ** RENDER **
   ************/
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
              cStyles.textBody,
              cStyles.pr10,
              cStyles.colorWhite,
              textStyle,
            ]}
            label={t(labelLeft)}
          />
        )}

        <CIcon
          name={value ? Icons.checkSquare : Icons.square}
          size={'medium'}
          customColor={value ? colors.SECONDARY : colors.WHITE}
        />

        {labelRight && (
          <CText
            customStyles={[
              cStyles.textBody,
              cStyles.pl6,
              cStyles.colorWhite,
              textStyle,
            ]}
            label={t(labelRight)}
          />
        )}
      </Animatable.View>
    </TouchableOpacity>
  );
}

CCheckbox.propTypes = {
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  labelLeft: PropTypes.string,
  labelRight: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default React.memo(CCheckbox);

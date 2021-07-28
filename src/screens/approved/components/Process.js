/**
 ** Name: Process of request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Process.js
 **/
import React, {createRef} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
import CActionSheet from '~/components/CActionSheet';
import RequestProcess from './RequestProcess';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

const actionSheetProcessRef = createRef();

function Process(props) {
  const {
    isDark = false,
    customColors = {},
    statusColor = '',
    statusName = '',
    statusIcon = '',
    statusID = -1,
    data = [],
  } = props;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleShowProcess = () => {
    actionSheetProcessRef.current?.show();
  };

  /************
   ** RENDER **
   ************/
  return (
    <>
      <CTouchable
        containerStyle={[cStyles.rounded2, cStyles.mx32, cStyles.mt16]}
        onPress={handleShowProcess}>
        <View
          style={[
            cStyles.px10,
            cStyles.row,
            cStyles.center,
            cStyles.rounded2,
            cStyles.borderDashed,
            cStyles.borderAll,
            statusID < Commons.STATUS_REQUEST.DONE.value &&
              cStyles.justifyBetween,
            isDark && cStyles.borderAllDark,
            {backgroundColor: customColors.card},
          ]}>
          <View style={[cStyles.center, cStyles.p10]}>
            <Icon
              name={statusIcon}
              size={moderateScale(24)}
              color={customColors[statusColor]}
            />
            <CText
              customStyles={[
                cStyles.textSubheadline,
                cStyles.mt6,
                {color: customColors[statusColor]},
              ]}
              customLabel={statusName}
            />
          </View>

          {statusID < Commons.STATUS_REQUEST.DONE.value && (
            <Icon
              name={Icons.nextStep}
              size={moderateScale(25)}
              color={customColors.icon}
            />
          )}

          {statusID < Commons.STATUS_REQUEST.DONE.value && (
            <View style={[cStyles.center, cStyles.p10]}>
              <Icon
                name={Icons.alert}
                size={moderateScale(30)}
                color={customColors.orange}
              />
            </View>
          )}
        </View>
      </CTouchable>

      <CActionSheet actionRef={actionSheetProcessRef}>
        <RequestProcess
          data={data}
          customColors={customColors}
          isDark={isDark}
        />
      </CActionSheet>
    </>
  );
}

export default Process;

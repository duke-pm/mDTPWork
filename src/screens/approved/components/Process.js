/**
 ** Name: Process of request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Process.js
 **/
import PropTypes from 'prop-types';
import React, {createRef} from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CTouchable from '~/components/CTouchable';
import CActionSheet from '~/components/CActionSheet';
import CIcon from '~/components/CIcon';
import RequestProcess from './RequestProcess';
/* COMMON */
import Icons from '~/utils/common/Icons';
import Commons from '~/utils/common/Commons';
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

const asProcessRef = createRef();
const sizeLargeIcon = moderateScale(30);

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
  const handleShowProcess = () => asProcessRef.current?.show();

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
            <CIcon name={statusIcon} size={'large'} color={statusColor} />
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
            <CIcon name={Icons.nextStep} size={'large'} />
          )}

          {statusID < Commons.STATUS_REQUEST.DONE.value && (
            <View style={[cStyles.center, cStyles.p10]}>
              <CIcon
                name={Icons.alert}
                customSize={sizeLargeIcon}
                color={'orange'}
              />
            </View>
          )}
        </View>
      </CTouchable>

      <CActionSheet actionRef={asProcessRef}>
        <RequestProcess
          data={data}
          customColors={customColors}
          isDark={isDark}
        />
      </CActionSheet>
    </>
  );
}

Process.propTypes = {
  isDark: PropTypes.bool.isRequired,
  customColors: PropTypes.object.isRequired,
  statusColor: PropTypes.string,
  statusName: PropTypes.string,
  statusIcon: PropTypes.string,
  statusID: PropTypes.number,
  data: PropTypes.array,
};

export default Process;

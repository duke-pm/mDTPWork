/**
 ** Name: Footer Form Request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of FooterFormRequest.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Layout, Icon, useTheme} from '@ui-kitten/components';
/* COMMON */
import {cStyles} from '~/utils/style';

const RenderRejectIcon = props => (
  <Icon {...props} name="close-outline" />
);

const RenderApprovedIcon = props => (
  <Icon {...props} name="checkmark-outline" />
);

function FooterFormRequest(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    loading = false,
    onReject = () => null,
    onApproved = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
   return (
    <Layout
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyEvenly,
        cStyles.py10,
        cStyles.borderTop,
        {borderTopColor: theme['border-basic-color-3']}
      ]}>
      <Button
        style={{flex: 0.45}}
        status="danger"
        disabled={loading.main}
        accessoryLeft={RenderRejectIcon}
        onPress={onReject}>
        {t('common:reject')}
      </Button>
      <Button
        style={{flex: 0.45}}
        status="success"
        disabled={loading.main}
        accessoryLeft={RenderApprovedIcon}
        onPress={onApproved}>
        {t('common:approved')}
      </Button>
    </Layout>
  );
}

FooterFormRequest.propTypes = {
  loading: PropTypes.bool,
  onReject: PropTypes.func,
  onApproved: PropTypes.func,
};

export default React.memo(FooterFormRequest);

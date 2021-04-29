/**
 ** Name: Forgot Password
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of ForgotPassword.js
 **/
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  ImageBackground,
  Image,
  View,
  KeyboardAvoidingView,
} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CInput from '~/components/CInput';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
/* COMMON */
import Routes from '~/navigation/Routes';
import Assets from '~/utils/asset/Assets';
import { colors, cStyles } from '~/utils/style';
import { IS_IOS, resetRoute } from '~/utils/helper';
/* REDUX */

const INPUT_NAME = {
  EMAIL: 'email',
};

function ForgotPassword(props) {
  const { t } = useTranslation();
  let emailRef = useRef();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
  });

  /** HANDLE FUNC */
  const handleSend = () => {

  };

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      title={'forgot_password:title'}
      header
      hasBack
      content={
        <ImageBackground
          style={styles.img_background}
          source={Assets.bgAuthentication}
          resizeMode={'cover'}
          blurRadius={5}
        >
          <View style={[cStyles.flex1, styles.content]}>
            <KeyboardAvoidingView
              style={cStyles.flex1}
              behavior={IS_IOS ? 'padding' : undefined}
            >
              <CContent
                style={styles.con}
                contentStyle={[cStyles.flexCenter, cStyles.px48]}
              >
                <View style={[cStyles.justifyEnd, styles.con_icon_app]}>
                  <Image
                    style={styles.img_icon_app}
                    source={Assets.iconApp}
                    resizeMode={'contain'}
                  />
                </View>

                <View style={[cStyles.itemsCenter, styles.con_middle]}>
                  <CText styles={'textCenter colorWhite mt10'} label={'forgot_password:sub_title'} />
                </View>

                <View style={[cStyles.pt16, styles.con_input]}>
                  <CInput
                    id={INPUT_NAME.EMAIL}
                    style={styles.input}
                    inputRef={ref => emailRef = ref}
                    disabled={loading}
                    icon={'at'}
                    iconColor={colors.GRAY_500}
                    holder={'forgot_password:input_email'}
                    valueColor={colors.WHITE}
                    returnKey={'send'}
                    autoFocus
                    onChangeInput={handleSend}
                  />

                  <CButton
                    style={cStyles.mt16}
                    block
                    disabled={loading}
                    label={'common:send'}
                    onPress={handleSend}
                  />
                </View>
              </CContent>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      }
    />
  );
};

const styles = StyleSheet.create({
  con: { backgroundColor: colors.TRANSPARENT, },
  content: { backgroundColor: 'rgba(0, 0, 0, 0.4)', },
  con_icon_app: { flex: 0.3 },
  con_middle: { flex: 0.1 },
  con_input: { flex: 0.6, },
  input: { backgroundColor: colors.BACKGROUND_MODAL, },

  img_background: { height: '100%', width: '100%' },
  img_icon_app: { height: 100, width: 100 },
});

export default ForgotPassword;

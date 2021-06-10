/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CFooter from '~/components/CFooter';
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CInput from '~/components/CInput';
import CIconButton from '~/components/CIconButton';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

const INPUT_NAME = {
  MESSAGE: 'message',
};

const RenderInputMessage = ({
  value = '',
  onSend = () => {},
  handleChangeText = () => {},
}) => {
  return (
    <View style={[cStyles.px16, cStyles.row, cStyles.itemsCenter]}>
      <CInput
        name={INPUT_NAME.MESSAGE}
        containerStyle={styles.input}
        styleFocus={styles.input_focus}
        holder={'project_management:holder_input_your_comment'}
        value={value}
        keyboard={'default'}
        returnKey={'send'}
        onChangeInput={onSend}
        onChangeValue={handleChangeText}
      />
      <View style={[cStyles.flexCenter, cStyles.pt10]}>
        <CIconButton
          disabled={value === ''}
          iconName={'send'}
          iconColor={value === '' ? colors.GRAY_500 : colors.SECONDARY}
          onPress={onSend}
        />
      </View>
    </View>
  );
};

function Activity(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    taskID = '',
    language = 'vi',
    refreshToken = '',
    navigation = null,
    visible = false,
    onClose = () => {},
  } = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  /** HANDLE FUNC */
  const handleClose = () => {
    onClose();
  };

  /** FUNC */
  const onPrepareData = () => {
    let activities = projectState.get('activities');
    console.log('[LOG] === activities ===> ', activities);
    setMessages(activities);
    setLoading({main: false, send: false});
  };

  const onSendMessage = () => {
    setLoading({...loading, send: true});
    Keyboard.dismiss();
    setValueMessage('');
    let params = {
      LineNum: 0,
      TaskID: taskID,
      Comments: valueMessage,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskComment(params, navigation));
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:send_comment'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({main: false, send: false});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskComment')) {
        if (projectState.get('successTaskComment')) {
          return onPrepareData();
        }

        if (projectState.get('errorTaskComment')) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    projectState.get('submittingTaskComment'),
    projectState.get('successTaskComment'),
    projectState.get('errorTaskComment'),
  ]);

  /** RENDER */
  return (
    <Modal
      style={cStyles.m0}
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0}>
      <SafeAreaView
        style={[
          cStyles.flex1,
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}
        edges={['right', 'left', 'top']}>
        {isDark && IS_IOS && (
          <BlurView
            style={[cStyles.abs, cStyles.inset0]}
            blurType={'extraDark'}
            reducedTransparencyFallbackColor={colors.BLACK}
          />
        )}
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          {/** Header */}
          <CHeader
            centerStyle={cStyles.center}
            left={
              <TouchableOpacity
                style={cStyles.itemsStart}
                onPress={handleClose}>
                <Icon
                  style={cStyles.p16}
                  name={'x'}
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            }
            title={'project_management:title_activity'}
          />

          {/** Content */}
          <CContent>
            {!loading.main && (
              <CList
                contentStyle={cStyles.pt16}
                scrollToBottom
                data={messages}
                item={({item, index}) => {
                  return (
                    <View
                      style={[cStyles.row, cStyles.itemsStart, cStyles.pb16]}>
                      <CAvatar
                        size={'small'}
                        label={item.fullName}
                        customColors={customColors}
                      />
                      <View
                        style={[
                          cStyles.flex1,
                          cStyles.rounded2,
                          cStyles.p10,
                          cStyles.ml16,
                          {backgroundColor: customColors.card},
                        ]}>
                        <View
                          style={[
                            cStyles.row,
                            cStyles.itemsCenter,
                            cStyles.justifyBetween,
                          ]}>
                          <CText
                            customStyles={[
                              cStyles.textTitle,
                              {color: customColors.primary},
                            ]}
                            customLabel={item.fullName}
                          />
                          <CText
                            styles={'textMeta'}
                            customLabel={item.timeUpdate}
                          />
                        </View>

                        <View style={cStyles.mt10}>
                          <CText customLabel={item.comments} />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </CContent>
        </View>

        {/** Footer input message */}
        <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'}>
          <CFooter
            content={
              <RenderInputMessage
                value={valueMessage}
                onSend={onSendMessage}
                handleChangeText={setValueMessage}
              />
            }
          />
        </KeyboardAvoidingView>

        <CLoading visible={loading.main || loading.send} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  row_header: {height: 50},
  input_focus: {
    borderColor: colors.SECONDARY,
  },
  input: {width: '85%'},
});

export default Activity;

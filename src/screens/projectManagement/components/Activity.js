/**
 ** Name: Activity of Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import moment from 'moment';
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
  const {visible = false, onClose = () => {}} = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 6,
      user: 'Me',
      message: 'McClintock wrote to Before & After to explain his discovery.',
      createAt: '09/06/2021 09:20',
    },
    {
      id: 5,
      user: 'Cristiano Ronaldo',
      message:
        "So how did the classical Latin become so incoherent? According to McClintock, a 15th century typesetter likely scrambled part of Cicero's De Finibus in order to provide placeholder text to mockup various fonts for a type specimen book.",
      createAt: '09/06/2021 09:12',
    },
    {
      id: 4,
      user: 'Wayne Rooney',
      message:
        "McClintock's eye for detail certainly helped narrow the whereabouts of lorem ipsum's origin, however, the “how and when” still remain something of a mystery, with competing theories and timelines.",
      createAt: '09/06/2021 09:10',
    },
    {
      id: 3,
      user: 'Me',
      message:
        'The placeholder text, beginning with the line “Lorem ipsum dolor sit amet, consectetur adipiscing elit”, looks like Latin because in its youth, centuries ago, it was Latin.',
      createAt: '09/06/2021 09:05',
    },
    {
      id: 2,
      user: 'David de Gea',
      message:
        'Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text',
      createAt: '09/06/2021 09:04',
    },
    {
      id: 1,
      user: 'Alison Becker',
      message:
        "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.",
      createAt: '09/06/2021 09:00',
    },
  ]);

  /** HANDLE FUNC */
  const handleClose = () => {
    onClose();
  };

  /** FUNC */
  const onSendMessage = () => {
    Keyboard.dismiss();
    let tmpMessages = [...messages];
    tmpMessages.unshift({
      id: tmpMessages.length + 1,
      user: 'Me',
      message: valueMessage,
      createAt: moment().format('DD/MM/YYYY HH:mm'),
    });
    setMessages(tmpMessages);
    setValueMessage('');
  };

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
          {/** Header of filter */}
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

          <CContent>
            <CList
              contentStyle={cStyles.pt16}
              inverted
              data={messages}
              item={({item, index}) => {
                return (
                  <View style={[cStyles.row, cStyles.itemsStart, cStyles.pb16]}>
                    <CAvatar
                      size={'small'}
                      label={item.user}
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
                          customLabel={item.user}
                        />
                        <CText
                          styles={'textMeta'}
                          customLabel={item.createAt}
                        />
                      </View>

                      <View style={cStyles.mt10}>
                        <CText customLabel={item.message} />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </CContent>
        </View>
        <KeyboardAvoidingView behavior={'padding'}>
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
        <CLoading visible={loading} />
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

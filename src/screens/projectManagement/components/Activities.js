/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  View,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CIconButton from '~/components/CIconButton';
import CList from '~/components/CList';
import CIcon from '~/components/CIcon';
import CAvatar from '~/components/CAvatar';
import CIconHeader from '~/components/CIconHeader';
import CSearchBar from '~/components/CSearchBar';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';
import {
  LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_7,
  DEFAULT_FORMAT_DATE_8,
} from '~/config/constants';
import {LOCALE_VI, LOCALE_EN} from '~/utils/language/comment';
import {
  saveLocalInfo,
  getLocalInfo,
  moderateScale,
  IS_IOS,
  IS_ANDROID,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All ref */
let listRef = createRef();

/** All init */
const INPUT_NAME = {MESSAGE: 'message'};
const HEIGHT_INPUT_1 = moderateScale(40);
const HEIGHT_INPUT_2 = moderateScale(10);

const RenderInputMessage = React.memo(
  ({
    customColors = {},
    value = '',
    heightInput = 0,
    onSend = () => {},
    onSizeInputChange = () => {},
    handleChangeText = () => {},
  }) => {
    return (
      <View
        style={[
          ifIphoneX(cStyles.pb24, cStyles.pb6),
          cStyles.fullWidth,
          {backgroundColor: customColors.cardDisable},
        ]}>
        <View style={[cStyles.px16, cStyles.row, cStyles.itemsCenter]}>
          <CInput
            name={INPUT_NAME.MESSAGE}
            containerStyle={styles.input}
            style={[
              cStyles.py4,
              cStyles.rounded5,
              {
                color: customColors.text,
                height: Math.max(HEIGHT_INPUT_1, heightInput + HEIGHT_INPUT_2),
              },
            ]}
            styleInput={cStyles.px10}
            styleFocus={styles.input_focus}
            holder={'project_management:holder_input_your_comment'}
            value={value}
            onBlur={Keyboard.dismiss}
            returnKey={'default'}
            blurOnSubmit={false}
            multiline
            onChangeValue={handleChangeText}
            onContentSizeChange={onSizeInputChange}
          />
          <LinearGradient
            style={[
              cStyles.center,
              cStyles.rounded10,
              cStyles.mt6,
              cStyles.ml8,
              {backgroundColor: customColors.card},
            ]}
            colors={
              value === ''
                ? [colors.GRAY_500, customColors.cardDisable]
                : colors.BACKGROUND_GRADIENT_SEND
            }>
            <CIconButton
              disabled={value === ''}
              iconName={'send'}
              iconColor={value === '' ? colors.GRAY_500 : colors.WHITE}
              onPress={onSend}
            />
          </LinearGradient>
        </View>
      </View>
    );
  },
);

function Activity(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const {route, navigation} = props;
  const taskID = route.params.data.taskID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const userName = authState.getIn(['login', 'userName']);
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');
  if (language === 'vi') {
    moment.updateLocale('vi', LOCALE_VI);
  } else {
    moment.updateLocale('en', LOCALE_EN);
  }

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [showSearch, setShowSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState({
    data: [],
    active: 0,
  });
  const [heightInput, setHeightInput] = useState(0);
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  let arrayRef = [];

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setDataSearch({data: [], active: 0});
    setShowSearch(false);
  };

  const handleSearch = value => {
    let dataPos = [],
      i,
      j;
    for (i = 0; i < messages.length; i++) {
      for (j = 0; j < messages[i].data.length; j++) {
        if (
          messages[i].data[j].comments
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        ) {
          dataPos.push({section: i, item: j + 1});
        }
      }
    }
    if (dataPos.length > 0) {
      setDataSearch({data: dataPos, active: 0});
      listRef.scrollToLocation({
        animated: true,
        viewPosition: 0,
        itemIndex: dataPos[0].item,
        sectionIndex: dataPos[0].section,
      });
      arrayRef[dataPos[0].section].item[dataPos[0].item - 1].ref.rubberBand(
        1000,
      );
    }
  };

  const handleDownSearch = () => {
    listRef.scrollToLocation({
      animated: true,
      viewPosition: 0,
      itemIndex: dataSearch.data[dataSearch.active - 1].item,
      sectionIndex: dataSearch.data[dataSearch.active - 1].section,
    });
    setDataSearch({...dataSearch, active: dataSearch.active - 1});
    arrayRef[dataSearch.data[dataSearch.active - 1].section].item[
      dataSearch.data[dataSearch.active - 1].item - 1
    ].ref.pulse(1000);
  };

  const handleUpSearch = () => {
    listRef.scrollToLocation({
      animated: true,
      viewPosition: 0,
      itemIndex: dataSearch.data[dataSearch.active + 1].item,
      sectionIndex: dataSearch.data[dataSearch.active + 1].section,
    });
    setDataSearch({...dataSearch, active: dataSearch.active + 1});
    arrayRef[dataSearch.data[dataSearch.active + 1].section].item[
      dataSearch.data[dataSearch.active + 1].item - 1
    ].ref.pulse(1000);
  };

  /**********
   ** FUNC **
   **********/
  const done = () => setLoading({main: false, send: false});

  const onSizeInputChange = event =>
    setHeightInput(event.nativeEvent.contentSize.height);

  const onPrepareData = async isUpdate => {
    let array = [];
    let activities = projectState.get('activities');
    if (!isUpdate) {
      let item = null,
        date = null,
        find = null,
        tmp = null;
      for (item of activities) {
        date = moment(item.timeUpdate, DEFAULT_FORMAT_DATE_7).format(
          DEFAULT_FORMAT_DATE_8,
        );
        find = array.findIndex(f => f.title === date);
        if (find !== -1) {
          if (tmp && tmp.userName === item.userName) {
            item.showAvatar = false;
          } else {
            item.showAvatar = true;
          }
          array[find].data.unshift(item);
        } else {
          item.showAvatar = true;
          array.unshift({
            title: date,
            data: [item],
          });
        }
        tmp = item;
      }
    } else {
      array = [...messages];
      let lastCmt = activities[activities.length - 1];
      let date = moment(lastCmt.timeUpdate, DEFAULT_FORMAT_DATE_7).format(
        DEFAULT_FORMAT_DATE_8,
      );
      let find = array.findIndex(f => f.title === date);
      if (find !== -1) {
        array[0].data.unshift(lastCmt);
      } else {
        array.unshift({
          title: date,
          data: [lastCmt],
        });
      }
    }
    setMessages(array);
    return done();
  };

  const onSendMessage = () => {
    if (valueMessage.trim() !== '') {
      setLoading({...loading, send: true});
      Keyboard.dismiss();
      setValueMessage('');
      let params = {
        LineNum: 0,
        TaskID: taskID,
        Comments: valueMessage.trim(),
        Lang: language,
        RefreshToken: refreshToken,
      };
      return dispatch(Actions.fetchTaskComment(params, navigation));
    }
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:send_comment'),
      type: 'danger',
      icon: 'danger',
    });

    return done();
  };

  const onUpdateLastComment = async () => {
    let activities = projectState.get('activities');
    if (activities.length > 0) {
      let tmpLastComment = await getLocalInfo(LAST_COMMENT_TASK);
      if (!tmpLastComment) {
        tmpLastComment = [
          {
            taskID,
            value: activities[activities.length - 1].rowNum,
          },
        ];
        await saveLocalInfo({key: LAST_COMMENT_TASK, value: tmpLastComment});
      } else {
        let find = tmpLastComment.findIndex(f => f.taskID === taskID);
        if (find !== -1) {
          tmpLastComment[find].value = activities[activities.length - 1].rowNum;
        } else {
          tmpLastComment.push({
            taskID,
            value: activities[activities.length - 1].rowNum,
          });
        }
        await saveLocalInfo({key: LAST_COMMENT_TASK, value: tmpLastComment});
      }
    }
  };

  const onCheckRef = (index, ref) => {
    if (index === 0 && arrayRef.length !== 0) {
      arrayRef.push({
        section: arrayRef.length,
        item: [{idx: index, ref}],
      });
    } else if (arrayRef.length === 0) {
      arrayRef.push({
        section: arrayRef.length,
        item: [{idx: index, ref}],
      });
    } else {
      arrayRef[arrayRef.length - 1].item.push({idx: index, ref});
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onUpdateLastComment();
    onPrepareData(false);
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskComment')) {
        if (projectState.get('successTaskComment')) {
          onUpdateLastComment();
          return onPrepareData(true);
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

  useLayoutEffect(() => {
    if (messages.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <CIconHeader
            icons={[
              {
                show: true,
                showRedDot: false,
                icon: 'search',
                onPress: handleOpenSearch,
              },
            ]}
          />
        ),
      });
    }
  }, [navigation, messages.length]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main || loading.send}
      content={
        <View style={cStyles.flex1}>
          {showSearch && (
            <View
              style={[
                cStyles.itemsCenter,
                cStyles.borderBottom,
                dataSearch.data.length === 0 && cStyles.pb10,
                dataSearch.data.length > 0 && styles.con_search,
              ]}>
              <CSearchBar
                containerStyle={IS_ANDROID ? cStyles.mx20 : {}}
                isVisible={showSearch}
                onSearch={handleSearch}
                onClose={handleCloseSearch}
              />

              {dataSearch.data.length > 0 ? (
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <TouchableOpacity
                    disabled={
                      dataSearch.data.length < 2 || dataSearch.active === 0
                    }
                    onPress={handleDownSearch}>
                    <CIcon
                      style={cStyles.p10}
                      name={Icons.downItem}
                      size={'medium'}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[cStyles.textCaption1, {color: customColors.text}]}>
                    {dataSearch.active + 1}/{dataSearch.data.length}
                  </Text>

                  <TouchableOpacity
                    disabled={
                      dataSearch.data.length < 2 ||
                      dataSearch.active === dataSearch.data.length - 1
                    }
                    onPress={handleUpSearch}>
                    <CIcon
                      style={cStyles.p10}
                      name={Icons.downItem}
                      size={'medium'}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[cStyles.center, cStyles.my10]}>
                  <CText styles={'textCaption1'} label={'common:empty_info'} />
                </View>
              )}
            </View>
          )}
          <KeyboardAvoidingView
            style={cStyles.flex1}
            behavior={IS_IOS ? 'padding' : undefined}
            keyboardVerticalOffset={
              isIphoneX()
                ? moderateScale(68)
                : DeviceInfo.isTablet()
                ? moderateScale(46)
                : moderateScale(58)
            }>
            <CList
              contentStyle={[cStyles.pt10, cStyles.flexGrow]}
              viewRef={ref => (listRef = ref)}
              customColors={customColors}
              sectionList={true}
              inverted={messages.length > 0}
              textEmpty={t('project_management:empty_comment')}
              data={messages}
              item={({item, index}) => {
                if (item.userName === userName) {
                  return (
                    <View style={[cStyles.itemsEnd, cStyles.ml32]}>
                      <Animatable.View
                        ref={ref => onCheckRef(index, ref)}
                        style={[
                          cStyles.roundedTopLeft1,
                          cStyles.roundedTopRight1,
                          cStyles.roundedBottomLeft1,
                          cStyles.p10,
                          styles.con_me,
                        ]}>
                        <CText
                          styles={'colorWhite textRight'}
                          customLabel={item.comments}
                        />
                        <CText
                          styles={
                            'colorWhite textRight textCaption2 fontLight mt4'
                          }
                          customLabel={`${item.timeUpdate.split(' - ')[1]}`}
                        />
                      </Animatable.View>
                    </View>
                  );
                }
                return (
                  <View
                    style={[cStyles.flex1, cStyles.row, cStyles.itemsStart]}>
                    {item.showAvatar && (
                      <View style={styles.container_chat}>
                        <CAvatar size={'small'} label={item.fullName} />
                      </View>
                    )}
                    {!item.showAvatar && <View style={styles.container_chat} />}
                    <View style={styles.container_cmt}>
                      {item.showAvatar && (
                        <View style={cStyles.mb3}>
                          <CText
                            styles={'fontBold colorPrimary'}
                            customLabel={item.fullName}
                          />
                        </View>
                      )}
                      <Animatable.View
                        ref={ref => onCheckRef(index, ref)}
                        style={[
                          cStyles.roundedTopRight1,
                          cStyles.roundedBottomRight1,
                          cStyles.roundedBottomLeft1,
                          cStyles.p10,
                          {backgroundColor: customColors.cardHolder},
                        ]}>
                        <CText customLabel={item.comments} />
                        <CText
                          styles={'textCaption2 textRight fontLight mt4'}
                          customLabel={`${item.timeUpdate.split('-')[1]}`}
                        />
                      </Animatable.View>
                    </View>
                  </View>
                );
              }}
            />
            {!showSearch && (
              <RenderInputMessage
                customColors={customColors}
                value={valueMessage}
                heightInput={heightInput}
                onSizeInputChange={onSizeInputChange}
                onSend={onSendMessage}
                handleChangeText={setValueMessage}
              />
            )}
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_search: {height: moderateScale(110)},
  input_focus: {borderColor: colors.PRIMARY},
  input: {width: '85%'},
  container_chat: {flex: 0.1},
  container_cmt: {flex: 0.9},
  con_me: {backgroundColor: colors.BLUE},
});

export default Activity;

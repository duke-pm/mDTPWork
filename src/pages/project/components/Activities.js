/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {
  useTheme, Button, Input, Icon, Layout, Text,
} from '@ui-kitten/components';
import {
  StyleSheet, View, Keyboard, KeyboardAvoidingView,
  SectionList,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
import CAvatar from '~/components/CAvatar';
/* COMMON */
import {Assets} from '~/utils/asset';
import {colors, cStyles} from '~/utils/style';
import {ThemeContext} from '~/configs/theme-context';
import {
  AST_LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_7,
  DEFAULT_FORMAT_DATE_8,
  LIGHT,
} from '~/configs/constants';
import {
  saveLocalInfo,
  getLocalInfo,
  moderateScale,
  IS_IOS,
  IS_ANDROID,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

/** All init */
const INPUT_NAME = {MESSAGE: 'message'};

const RenderSendIcon = props => (
  <Icon {...props} name="paper-plane-outline" />
);

const RenderSectionFooter = ({section: {title}}) => {
  return (
    <View style={[cStyles.row, cStyles.itemsCenter, cStyles.center, cStyles.py16]}>
      <Text category="c1" appearance="hint">{title.toUpperCase()}</Text>
    </View>
  );
}

const RenderCommentItem = (info, theme, userName) => {
  if (info.item.userName === userName) {
    return (
      <View
        style={[
          cStyles.itemsEnd,
          cStyles.ml16,
          cStyles.mt5,
          cStyles.pr16,
        ]}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.p10,
            {backgroundColor: theme['color-primary-500']},
          ]}>
          <Text style={cStyles.textRight} status="control">
            {info.item.comments}
          </Text>
          <Text style={[cStyles.textRight, cStyles.mt5]} category="c2" status="control">
            {`${info.item.timeUpdate.split(' - ')[1]}`}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        cStyles.row,
        cStyles.mt5,
        cStyles.pr16,
        cStyles.pl10,
      ]}>
      {info.item.showAvatar && (
        <View style={[cStyles.itemsCenter, styles.container_chat]}>
          <CAvatar size={'small'} source={Assets.iconUser} />
        </View>
      )}
      {!info.item.showAvatar && (
        <View style={styles.container_chat} />
      )}
      <View style={cStyles.flex1}>
        {info.item.showAvatar && (
          <View style={cStyles.mb5}>
            <Text
              category="c1"
              appearance="hint">
              {info.item.fullName}
            </Text>
          </View>
        )}
        <View
          style={[
            cStyles.rounded1,
            cStyles.p10,
            {backgroundColor: theme['background-basic-color-3']},
          ]}>
          <Text>{info.item.comments}</Text>
          <Text style={cStyles.mt5} category="c2">
            {`${info.item.timeUpdate.split('- ')[1]}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const RenderInputMessage = ({
    loading = false,
    trans = {},
    value = '',
    themeApp = LIGHT,
    onSend = () => {},
    handleChangeText = () => {},
  }) => {
    return (
      <Layout
        style={[
          ifIphoneX(cStyles.pb24, cStyles.pb6),
          cStyles.fullWidth,,
        ]}
        level="3">
        <View
          style={[
            cStyles.px16,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.mt5,
          ]}>
          <Input
            style={[cStyles.flex1, cStyles.mr5]}
            testID={INPUT_NAME.MESSAGE}
            keyboardAppearance={themeApp}
            placeholder={trans('project_management:holder_input_your_comment')}
            value={value}
            blurOnSubmit={false}
            editable={!loading}
            multiline
            onBlur={Keyboard.dismiss}
            onChangeText={handleChangeText}
          />
          <Button
            size="small"
            disabled={value === '' || loading}
            accessoryLeft={RenderSendIcon}
            onPress={onSend}
          />
        </View>
      </Layout>
    );
};

function Activity(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {
    taskID = -1,
    navigation = null,
  } = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const userName = authState.getIn(['login', 'userName']);
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  /**********
   ** FUNC **
   **********/
  const done = () => setLoading({main: false, send: false});

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
      let tmpLastComment = await getLocalInfo(AST_LAST_COMMENT_TASK);
      if (!tmpLastComment) {
        tmpLastComment = [
          {
            taskID,
            value: activities[activities.length - 1].rowNum,
          },
        ];
        await saveLocalInfo({key: AST_LAST_COMMENT_TASK, value: tmpLastComment});
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
        await saveLocalInfo({key: AST_LAST_COMMENT_TASK, value: tmpLastComment});
      }
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

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={cStyles.flex1}>
      <KeyboardAvoidingView
        style={cStyles.flex1}
        behavior={IS_IOS ? 'padding' : undefined}
        keyboardVerticalOffset={ifIphoneX(230, 200)}>
        {!loading.main && (
          <SectionList
            style={cStyles.flex1}
            contentContainerStyle={[cStyles.py16, cStyles.flexGrow]}
            inverted={messages.length > 0}
            sections={messages}
            renderSectionFooter={RenderSectionFooter}
            renderItem={info => RenderCommentItem(info, theme, userName)}
            extraData={messages}
            keyExtractor={(item, index) => item.userName + '_' + index}
            removeClippedSubviews={IS_ANDROID}
            ListEmptyComponent={
              <View style={cStyles.center}>
                <CEmpty
                  style={{flex: undefined}}
                  description="project_management:empty_comment"
                />
              </View>
            }
          />
        )}
        <RenderInputMessage
          loading={loading.send}
          trans={t}
          themeApp={themeContext.themeApp}
          value={valueMessage}
          onSend={onSendMessage}
          handleChangeText={setValueMessage}
        />
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container_chat: {flex: 0.15},
});

export default Activity;

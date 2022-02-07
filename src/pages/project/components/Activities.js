/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect, useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {ifIphoneX} from "react-native-iphone-x-helper";
import {
  useTheme, Button, Input, Icon, Layout, Text,
  Spinner,
} from "@ui-kitten/components";
import {
  StyleSheet, View, Keyboard, KeyboardAvoidingView,
  SectionList,
} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CEmpty from "~/components/CEmpty";
import CAvatar from "~/components/CAvatar";
/* COMMON */
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {ThemeContext} from "~/configs/theme-context";
import {
  AST_LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_7,
  DEFAULT_FORMAT_DATE_9,
  LIGHT,
  REDUX_LOGIN,
} from "~/configs/constants";
import {
  saveLocalInfo,
  getLocalInfo,
  IS_IOS,
  IS_ANDROID,
} from "~/utils/helper";
/** REDUX */
import * as Actions from "~/redux/actions";

/** All init */
const INPUT_NAME = {
  MESSAGE: "message",
};
const colorPrimary = "color-primary-500";
const colorOutline = "outline-color";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderSendIcon = props => (
  <Icon {...props} name="paper-plane-outline" />
);

const RenderSectionFooter = ({section: {title}}) => {
  return (
    <View style={cStyles.flexCenter}>
      <Layout
        style={[
          cStyles.row,
          cStyles.center,
          cStyles.rounded4,
          cStyles.py5,
          cStyles.px10,
          cStyles.mt5,
        ]}
        level="4">
        <Text category="c2">{title}</Text>
      </Layout>
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
          info.index === 0 && cStyles.mb10,
        ]}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.p10,
            {backgroundColor: theme[colorPrimary]},
          ]}>
          <Text style={cStyles.textRight} status="control">
            {info.item.comments}
          </Text>
          <Text
            style={[cStyles.textRight, cStyles.mt2]}
            category="c2"
            appearance="hint">
            {`${info.item.timeUpdate.split(" - ")[1]}`}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={[
        cStyles.flex1,
        cStyles.row,
        cStyles.mt5,
        info.index === 0 && cStyles.mb10,
      ]}>
      {info.item.showAvatar && (
        <View style={[cStyles.itemsCenter, styles.con_person_left]}>
          <CAvatar source={Assets.iconUser} />
        </View>
      )}
      {!info.item.showAvatar && (
        <View style={styles.con_person_left} />
      )}
      <View style={[cStyles.itemsStart, styles.con_person_right]}>
        {info.item.showAvatar && (
          <View style={cStyles.mb5}>
            <Text
              category="c1"
              appearance="hint">
              {info.item.fullName}
            </Text>
          </View>
        )}
        <Layout
          style={[
            cStyles.rounded1,
            cStyles.py5,
            cStyles.px10,
            cStyles.borderAll,
            {borderColor: theme[colorOutline]},
          ]}>
          <Text>{info.item.comments}</Text>
          <Text style={cStyles.mt2} category="c2" appearance="hint">
            {`${info.item.timeUpdate.split("- ")[1]}`}
          </Text>
        </Layout>
      </View>
    </View>
  );
}

const RenderLoadingIcon = props => (
  <View style={[props.style, cStyles.center]}>
    <Spinner size="small" />
  </View>
);

const RenderInputMessage = ({
    loading = false,
    t = {},
    value = "",
    themeApp = LIGHT,
    onSend = () => null,
    handleChangeText = () => null,
  }) => {
    return (
      <Layout
        style={[
          ifIphoneX(cStyles.pb24, cStyles.pb6),
          cStyles.fullWidth,
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
            placeholder={t("project_management:holder_input_your_comment")}
            value={value}
            blurOnSubmit={false}
            disabled={loading}
            multiline
            onBlur={Keyboard.dismiss}
            onChangeText={handleChangeText}
          />
          <Button
            size="small"
            disabled={value === "" || loading}
            accessoryLeft={loading ? RenderLoadingIcon : RenderSendIcon}
            onPress={onSend}
          />
        </View>
      </Layout>
    );
};

/********************
 ** MAIN COMPONENT **
 ********************/
function Activity(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {
    taskID = -1,
    formatDateView = DEFAULT_FORMAT_DATE_9,
    navigation = null,
  } = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const userName = authState[REDUX_LOGIN]["userName"];
  const refreshToken = authState[REDUX_LOGIN]["refreshToken"];
  const language = commonState["language"];

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [valueMessage, setValueMessage] = useState("");
  const [messages, setMessages] = useState([]);

  /**********
   ** FUNC **
   **********/
  const done = () => setLoading({main: false, send: false});

  const onPrepareData = async isUpdate => {
    let array = [];
    let activities = projectState["activities"];
    if (!isUpdate) {
      let item = null,
        date = null,
        find = null,
        tmp = null;
      for (item of activities) {
        date = moment(item.timeUpdate, DEFAULT_FORMAT_DATE_7).format(
          formatDateView,
        );
        find = array.findIndex(f => f.title === date);
        if (find !== -1) {
          if (tmp) {
            if (tmp.userName === item.userName) {
              item.showAvatar = false;
            } else {
              item.showAvatar = true;
            }
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
        formatDateView,
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
    if (valueMessage.trim() !== "") {
      setLoading({...loading, send: true});
      setValueMessage("");
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
      message: t("common:app_name"),
      description: t("error:send_comment"),
      type: "danger",
      icon: "danger",
    });

    return done();
  };

  const onUpdateLastComment = async () => {
    let activities = projectState["activities"];
    if (activities.length > 0) {
      let tmpLastComment = await getLocalInfo(AST_LAST_COMMENT_TASK);
      if (!tmpLastComment) {
        tmpLastComment = [
          {
            taskID,
            value: activities[activities.length - 1]["rowNum"],
          },
        ];
        await saveLocalInfo({
          key: AST_LAST_COMMENT_TASK,
          value: tmpLastComment,
        });
      } else {
        let find = tmpLastComment.findIndex(f => f.taskID === taskID);
        if (find !== -1) {
          tmpLastComment[find]["value"] = activities[activities.length - 1]["rowNum"];
        } else {
          tmpLastComment.push({
            taskID,
            value: activities[activities.length - 1]["rowNum"],
          });
        }
        await saveLocalInfo({
          key: AST_LAST_COMMENT_TASK,
          value: tmpLastComment,
        });
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
      if (!projectState["submittingTaskComment"]) {
        if (projectState["successTaskComment"]) {
          onUpdateLastComment();
          return onPrepareData(true);
        }

        if (projectState["errorTaskComment"]) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    projectState["submittingTaskComment"],
    projectState["successTaskComment"],
    projectState["errorTaskComment"],
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={cStyles.flex1} level="2">
      <KeyboardAvoidingView
        style={cStyles.flex1}
        behavior={IS_IOS ? "padding" : undefined}
        keyboardVerticalOffset={ifIphoneX(230, 200)}>
        {!loading.main && (
          <SectionList
            contentContainerStyle={cStyles.flexGrow}
            sections={messages}
            renderSectionFooter={RenderSectionFooter}
            renderItem={info => RenderCommentItem(info, theme, userName)}
            extraData={messages}
            keyExtractor={(item, index) => item.userName + "_" + index}
            inverted={messages.length > 0}
            removeClippedSubviews={IS_ANDROID}
            ListEmptyComponent={
              <View style={cStyles.center}>
                <CEmpty
                  style={styles.con_empty}
                  description="project_management:empty_comment"
                />
              </View>
            }
          />
        )}
        <RenderInputMessage
          t={t}
          loading={loading.send}
          themeApp={themeContext.themeApp}
          value={valueMessage}
          onSend={onSendMessage}
          handleChangeText={setValueMessage}
        />
      </KeyboardAvoidingView>
    </Layout>
  );
}

Activity.propTypes = {
  taskID: PropTypes.number,
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  con_person_left: {flex: 0.2},
  con_person_right: {flex: 0.75},
  con_empty: {flex: undefined},
});

export default Activity;

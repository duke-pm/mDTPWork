/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Watchers of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Watchers.js
 **/
import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {
  Avatar, Button, Card, CheckBox, Icon, Layout, Text,
  useTheme,
} from "@ui-kitten/components";
import {
  StyleSheet, View, UIManager, LayoutAnimation,
} from "react-native";
import IoniIcon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CLoading from "~/components/CLoading";
import CEmpty from "~/components/CEmpty";
/* COMMON */
import Icons from "~/utils/common/Icons";
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {
  moderateScale,
  IS_ANDROID,
} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_7,
  DEFAULT_FORMAT_DATE_9,
  DEFAULT_FORMAT_TIME_1,
} from "~/configs/constants";
/** REDUX */
import * as Actions from "~/redux/actions";

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const sIconEmail = moderateScale(10);
const colorPrimary = "color-primary-500";

const RenderWatchNowIcon = props => (
  <Icon {...props} name="eye-outline" />
);

const RenderUnwatchIcon = props => (
  <Icon {...props} name="eye-off-outline" />
);

function Watchers(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation, taskID = -1} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const userName = authState["login"]["userName"];
  const refreshToken = authState["login"]["refreshToken"];
  const language = commonState["language"];

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [needRefresh, setNeedRefresh] = useState(false);
  const [watchers, setWatchers] = useState([]);
  const [watched, setWatched] = useState({
    status: projectState["isWatched"],
    email: projectState["isReceivedEmail"],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFollow = () => {
    let params = {
      TaskID: taskID,
      IsWatched: !watched.status,
      IsReceiveEmail: true,
      Lang: language,
      RefreshToken: refreshToken,
      UserName: userName,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    setLoading({...loading, send: true});
    setWatched({
      status: !watched.status,
      email: true,
    });
    if (!needRefresh) {
      setNeedRefresh(true);
    }
  };

  const handleGetEmail = () => {
    let params = {
      TaskID: taskID,
      IsWatched: watched.status,
      IsReceiveEmail: !watched.email,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    setLoading({...loading, send: true});
    setWatched({
      status: watched.status,
      email: !watched.email,
    });
  };

  /**********
   ** FUNC **
   **********/
  const done = () => setLoading({main: false, send: false});

  const onPrepareData = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    /** Set list watchers */
    let tmpWatchers = projectState["watchers"];
    setWatchers(tmpWatchers);
    return done();
  };

  const onError = () => {
    showMessage({
      message: t("common:app_name"),
      description: t("error:send_follow"),
      type: "danger",
      icon: "danger",
    });

    return done();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState["submittingTaskWatcher"]) {
        if (projectState["successTaskWatcher"]) {
          return onPrepareData();
        }

        if (projectState["errorTaskWatcher"]) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    projectState["submittingTaskWatcher"],
    projectState["successTaskWatcher"],
    projectState["errorTaskWatcher"],
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <Layout level="2">
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.mt16,
          cStyles.mx16,
        ]}>
        <View style={styles.con_watch_left}>
          <Button
            status={!watched.status
              ? "primary"
              : "danger"}
            size="small"
            accessoryLeft={!watched.status
              ? RenderWatchNowIcon
              : RenderUnwatchIcon}
            onPress={handleFollow}>
            {t(!watched.status
              ? "project_management:you_not_watch"
              : "project_management:you_watched")}
          </Button>
        </View>
        {watched.status && (
          <View style={[cStyles.ml10, styles.con_watch_right]}>
            <CheckBox
              checked={watched.email}
              onChange={handleGetEmail}>
              {t("project_management:title_get_watcher")}
            </CheckBox>
          </View>
        )}
      </View>

      {!loading.main && (
        <Card
          style={cStyles.m16}
          disabled
          header={
            <Text category="s1">{t("project_management:list_watchers")}</Text>
          }>
          {watchers.length > 0
            ?
              watchers.map((item, index) => {
                let time = moment(
                  item.timeUpdate,
                  DEFAULT_FORMAT_DATE_7,
                ).format(DEFAULT_FORMAT_TIME_1);
                let date = moment(
                  item.timeUpdate,
                  DEFAULT_FORMAT_DATE_7,
                ).format(DEFAULT_FORMAT_DATE_9);

                return (
                  <View
                    key={index + item.userName}
                    style={[
                      cStyles.row,
                      cStyles.itemsCenter,
                      index !== 0 && cStyles.mt10,
                    ]}>
                    <View>
                      <Avatar source={Assets.iconUser} />
                      {item.isReceiveEmail && (
                        <Layout
                          style={[
                            cStyles.center,
                            cStyles.rounded5,
                            cStyles.abs,
                            cStyles.right0,
                            styles.con_icon,
                          ]} level="3">
                          <IoniIcon
                            name={Icons.mailTask}
                            color={theme[colorPrimary]}
                            size={sIconEmail}
                          />
                        </Layout>
                      )}
                    </View>
                    <View
                      style={[
                        cStyles.flex1,
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                        cStyles.ml10,
                        index !== -1 && cStyles.py6,
                      ]}>
                      <View style={styles.con_left}>
                        <Text>
                          {item.fullName}
                          <Text category="c1">
                            {item.userName === userName
                              ? ` (${t("common:its_you")})`
                              : ""}
                          </Text>
                        </Text>
                        <Text category="c1" appearance="hint">{item.userName}</Text>
                      </View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyEnd,
                          styles.con_right,
                        ]}>
                        <View style={cStyles.itemsEnd}>
                          <Text category="c1" appearance="hint">{date}</Text>
                          <Text category="c1" appearance="hint">{time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            :
              <View style={cStyles.center}>
                <CEmpty
                  style={styles.con_empty}
                  description="project_management:empty_watchers"
                />
              </View>
            }
        </Card>
      )}

      <CLoading show={loading.send} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_watch_left: {flex: 0.4},
  con_watch_right: {flex: 0.6}, 
  con_left: {flex: 0.65},
  con_right: {flex: 0.35},
  con_icon: {
    height: moderateScale(14),
    width: moderateScale(14),
    bottom: -moderateScale(4),
  },
  con_empty: {flex: undefined},
});

export default Watchers;

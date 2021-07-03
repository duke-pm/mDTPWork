/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Percentage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Percentage.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMMON */
import {THEME_DARK, THEME_LIGHT} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import Commons from '~/utils/common/Commons';
/** REDUX */
import * as Actions from '~/redux/actions';
import {fS} from '~/utils/helper';

/** All refs of page */
let percentRef = createRef();

function Percentage(props) {
  const {t} = useTranslation();
  const {
    disabled,
    isDark,
    customColors,
    navigation,
    language,
    refreshToken,
    task,
    onUpdate,
  } = props;
  let curPercent = task.percentage;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState({
    visible: false,
    value: 0,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangePercent = () => {
    if (percent.visible) {
      if (percent.value < 0 || percent.value > 100) {
        showMessage({
          message: t('common:app_name'),
          description: t('project_management:warning_input_percent'),
          type: 'warning',
          icon: 'warning',
        });
        return percentRef.focus();
      } else {
        if (Number(percent.value) === task.percentage) {
          return setPercent({...percent, visible: !percent.visible});
        }
        setPercent({...percent, visible: !percent.visible});
        let params = {
          TaskID: task.taskID,
          StatusID: task.statusID,
          Percentage: percent.value,
          Lang: language,
          RefreshToken: refreshToken,
        };
        dispatch(Actions.fetchUpdateTask(params, navigation));
        return setLoading(true);
      }
    } else {
      return setPercent({...percent, visible: !percent.visible});
    }
  };

  const onUpdateActivities = () => {
    let paramsActivities = {
      LineNum: 0,
      TaskID: task.taskID,
      Comments: `* ${t(
        'project_management:holder_task_percentage',
      ).toUpperCase()} (%) ${t(
        'project_management:holder_change_from',
      )} ${curPercent} ${t('project_management:holder_change_to')} ${
        percent.value
      }.`,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskComment(paramsActivities, navigation));
    curPercent = percent.value;
    return;
  };

  const handleClosePercent = () => {
    setPercent({visible: !percent.visible, value: task.percentage});
  };

  /************
   ** FUNC **
   ************/
  const onChangePercent = value => {
    setPercent({...percent, value: Number(value) + ''});
  };

  const onPrepareUpdate = isSuccess => {
    let des = isSuccess
      ? 'success:change_percent'
      : projectState.get('errorHelperTaskUpdate');
    let type = isSuccess ? 'success' : 'danger';
    if (isSuccess) {
      onUpdate();
    } else {
      setPercent({...percent, value: task.percentage});
    }
    setLoading(false);
    return showMessage({
      message: isSuccess ? t('common:app_name') : des,
      description: t(des),
      type,
      icon: type,
    });
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    setPercent({...percent, value: task.percentage});
  }, []);

  useEffect(() => {
    if (percent.visible) {
      percentRef.focus();
    }
  }, [percent.visible]);

  useEffect(() => {
    if (loading) {
      if (!projectState.get('submittingTaskUpdate')) {
        if (projectState.get('successTaskUpdate')) {
          onUpdateActivities();
          return onPrepareUpdate(true);
        }

        if (projectState.get('errorTaskUpdate')) {
          return onPrepareUpdate(false);
        }
      }
    }
  }, [
    loading,
    projectState.get('submittingTaskUpdate'),
    projectState.get('successTaskUpdate'),
    projectState.get('errorTaskUpdate'),
  ]);

  /**************
   ** RENDER **
   **************/
  const isDisable =
    task.statusID == Commons.STATUS_TASK.ON_HOLD.value ||
    task.statusID == Commons.STATUS_TASK.REJECTED.value ||
    task.statusID == Commons.STATUS_TASK.CLOSED.value;
  return (
    <TouchableOpacity
      style={cStyles.flex1}
      disabled={!task.isUpdated || loading || disabled || isDisable}
      onPress={handleChangePercent}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.flex1]}>
        {!percent.visible ? (
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.ml3,
              cStyles.mr10,
              cStyles.flex1,
            ]}>
            <View
              style={[
                cStyles.flex1,
                cStyles.justifyCenter,
                cStyles.rounded5,
                cStyles.borderAll,
                cStyles.m1,
                styles.percent_active,
              ]}
            />
            <View
              style={[
                cStyles.abs,
                cStyles.roundedTopLeft5,
                cStyles.roundedBottomLeft5,
                percent.value === 100 && cStyles.roundedTopRight5,
                percent.value === 100 && cStyles.roundedBottomRight5,
                cStyles.itemsEnd,
                cStyles.justifyCenter,
                styles.percent_body,
                {
                  width: `${percent.value}%`,
                  backgroundColor:
                    !task.isUpdated || isDisable
                      ? customColors.textDisable
                      : customColors.primary,
                },
              ]}>
              {percent.value > 25 && (
                <Text
                  style={[
                    cStyles.fontMedium,
                    cStyles.textCenter,
                    cStyles.mr3,
                    {color: colors.WHITE, fontSize: 10},
                  ]}>{`${percent.value}%`}</Text>
              )}
            </View>
            <View
              style={[
                cStyles.abs,
                cStyles.right0,
                cStyles.roundedTopRight5,
                cStyles.roundedBottomRight5,
                percent.value === 0 && cStyles.roundedTopLeft5,
                percent.value === 0 && cStyles.roundedBottomLeft5,
                cStyles.itemsStart,
                cStyles.justifyCenter,
                {
                  height: 16,
                  width: `${100 - percent.value}%`,
                },
              ]}>
              {percent.value <= 25 && (
                <Text
                  style={[
                    cStyles.fontMedium,
                    cStyles.textCenter,
                    cStyles.ml5,
                    styles.text_percent,
                    {
                      color:
                        !task.isUpdated || isDisable
                          ? customColors.textDisable
                          : customColors.primary,
                    },
                  ]}>{`${percent.value}%`}</Text>
              )}
            </View>
          </View>
        ) : (
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <View
              style={[
                cStyles.px4,
                cStyles.borderAll,
                cStyles.rounded1,
                cStyles.justifyCenter,
                styles.percent_input,
              ]}>
              <TextInput
                ref={ref => (percentRef = ref)}
                style={[
                  cStyles.textDefault,
                  cStyles.px4,
                  {color: customColors.text},
                ]}
                editable={!loading}
                autoFocus
                selectTextOnFocus
                blurOnSubmit
                placeholder={t('project_management:holder_task_percentage')}
                value={percent.value + ''}
                keyboardAppearance={isDark ? THEME_DARK : THEME_LIGHT}
                keyboardType={'number-pad'}
                returnKeyType={'done'}
                onChangeText={onChangePercent}
                onSubmitEditing={handleChangePercent}
              />
            </View>
            <TouchableOpacity
              style={[cStyles.p3, cStyles.ml16]}
              disabled={loading}
              onPress={handleClosePercent}>
              <Icon
                name={'close-circle'}
                size={fS(18)}
                color={customColors.red}
              />
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <ActivityIndicator style={cStyles.pl2} color={colors.GRAY_500} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  percent_active: {height: 16},
  percent_body: {height: 16},
  percent_input: {width: '40%', height: 45},
  text_percent: {fontSize: 10},
});

export default Percentage;

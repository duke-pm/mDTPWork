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
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
/* COMMON */
import {THEME_DARK, THEME_LIGHT} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

/** All refs of page */
let percentRef = createRef();

function Percentage(props) {
  const {t} = useTranslation();
  const {
    isDark,
    customColors,
    navigation,
    language,
    refreshToken,
    task,
    onUpdate,
  } = props;

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
        percentRef.focus();
      } else {
        if (Number(percent.value) === task.percentage) {
          setPercent({...percent, visible: !percent.visible});
        } else if (Number(percent.value) < task.percentage) {
          showMessage({
            message: t('common:app_name'),
            description: t('project_management:warning_input_percent_smaller'),
            type: 'warning',
            icon: 'warning',
          });
        } else {
          setPercent({...percent, visible: !percent.visible});
          let params = {
            TaskID: task.taskID,
            StatusID: task.statusID,
            Percentage: percent.value,
            Lang: language,
            RefreshToken: refreshToken,
          };
          dispatch(Actions.fetchUpdateTask(params, navigation));
          setLoading(true);
        }
      }
    } else {
      setPercent({...percent, visible: !percent.visible});
    }
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
    let des = isSuccess ? 'success:change_percent' : 'error:change_percent';
    let type = isSuccess ? 'success' : 'danger';
    if (isSuccess) {
      onUpdate();
    }
    setLoading(false);
    return showMessage({
      message: t('common:app_name'),
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
  return (
    <View
      style={[
        cStyles.py10,
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyBetween,
      ]}>
      <TouchableOpacity
        style={styles.con_left}
        disabled={!task.isUpdated || loading}
        onPress={handleChangePercent}>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <CLabel label={'project_management:task_percentage'} />

          {!percent.visible ? (
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pl10]}>
              <View style={styles.percent}>
                <View
                  style={[
                    cStyles.fullWidth,
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
                      top: 2,
                      width: `${percent.value}%`,
                      backgroundColor: !task.isUpdated
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
                      height: 14,
                      width: `${100 - percent.value}%`,
                    },
                  ]}>
                  {percent.value <= 25 && (
                    <Text
                      style={[
                        cStyles.fontMedium,
                        cStyles.textCenter,
                        cStyles.ml5,
                        IS_IOS ? cStyles.mt3 : cStyles.mt2,
                        {
                          color: !task.isUpdated
                            ? customColors.textDisable
                            : customColors.primary,
                          fontSize: 10,
                        },
                      ]}>{`${percent.value}%`}</Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.fullWidth]}>
              <View
                style={[
                  cStyles.px4,
                  cStyles.borderAll,
                  cStyles.rounded1,
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
                  // onEndEditing={handleChangePercent}
                />
              </View>
              <TouchableOpacity
                style={[cStyles.p3, cStyles.ml16]}
                disabled={loading}
                onPress={handleClosePercent}>
                <Icon name={'x'} size={18} color={customColors.red} />
              </TouchableOpacity>
            </View>
          )}

          {loading && <ActivityIndicator />}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.5},
  percent_active: {height: 16},
  percent_body: {height: 14.5},
  percent_input: {width: '40%'},
  percent: {width: '85%'},
});

export default Percentage;

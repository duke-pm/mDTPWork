/**
 ** Name: List Task screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Task.js
 **/
import React, {useState} from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CList from '~/components/CList';
import CAlert from '~/components/CAlert';
import CText from '~/components/CText';
import TaskItem from '../components/TaskItem';
/** COMMON */
import Routes from '~/navigation/Routes';
import Commons from '~/utils/common/Commons';
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';

let isPrevIsParent = false;

function ListTask(props) {
  const navigation = useNavigation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {refreshing, onRefresh, onRefreshTasks} = props;

  /** Use state */
  const [showInfo, setShowInfo] = useState(false);
  const [dataDetail, setDataDetail] = useState(false);

  /** HANDLE FUNC */
  const handleTaskItem = data => {
    navigation.navigate(Routes.MAIN.TASK_DETAIL.name, {
      data: {
        taskID: data.taskID,
        isUpdated: data.isUpdated,
      },
      onRefresh: () => onRefresh(),
    });
  };

  const handleShowDetail = (data = null) => {
    setDataDetail(data);
    setShowInfo(!showInfo);
  };

  /** RENDER */
  let isOutOfDate = false,
    bgPriority = customColors[Commons.PRIORITY_TASK.LOW.color]; // default is Low;
  if (dataDetail) {
    if (!dataDetail.priorityColor) {
      if (dataDetail.priority === Commons.PRIORITY_TASK.MEDIUM.value) {
        bgPriority = customColors[Commons.PRIORITY_TASK.MEDIUM.color];
      } else if (dataDetail.priority === Commons.PRIORITY_TASK.HIGH.value) {
        bgPriority = customColors[Commons.PRIORITY_TASK.HIGH.color];
      }
    } else {
      bgPriority = dataDetail.priorityColor;
    }

    if (
      moment().valueOf() -
        moment(dataDetail.endDate, 'DD/MM/YYYYTHH:mm:ss').valueOf() >
      0
    ) {
      isOutOfDate = true;
    }
  }

  return (
    <View style={cStyles.flex1}>
      <CList
        contentStyle={cStyles.pt16}
        scrollToTop={false}
        textEmpty={'project_management:empty_tasks'}
        data={props.data}
        item={({item, index}) => {
          isPrevIsParent = false;
          if (props.data[index - 1] && props.data[index - 1].countChild > 0) {
            isPrevIsParent = true;
          }
          return (
            <TaskItem
              index={index}
              data={item}
              customColors={customColors}
              isDark={isDark}
              isPrevIsParent={isPrevIsParent}
              onPress={handleTaskItem}
              onShowDetail={handleShowDetail}
            />
          );
        }}
        refreshing={refreshing}
        onRefresh={onRefreshTasks}
      />

      <CAlert
        show={showInfo}
        title={`#${dataDetail?.taskID} ${dataDetail?.taskName}`}
        customContent={
          <View
            style={[cStyles.row, cStyles.itemsStart, cStyles.justifyBetween]}>
            <View style={styles.content_left}>
              {/** grade */}
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <CText styles={'textMeta'} label={'project_management:grade'} />
                <CText
                  styles={'textMeta fontRegular'}
                  customLabel={dataDetail?.grade || '-'}
                />
              </View>

              {/** Start date */}
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:start_date'}
                />
                <CText
                  styles={'textMeta fontRegular'}
                  customLabel={
                    dataDetail
                      ? moment(
                          dataDetail.startDate,
                          'YYYY-MM-DDTHH:mm:ss',
                        ).format('DD/MM/YYYY')
                      : '-'
                  }
                />
              </View>

              {/** End date */}
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:end_date'}
                />
                <CText
                  styles={'textMeta fontRegular'}
                  customStyles={[
                    cStyles.textMeta,
                    cStyles.fontRegular,
                    isOutOfDate && {color: customColors.red},
                  ]}
                  customLabel={
                    dataDetail
                      ? moment(
                          dataDetail.endDate,
                          'YYYY-MM-DDTHH:mm:ss',
                        ).format('DD/MM/YYYY')
                      : '-'
                  }
                />
              </View>
            </View>

            <View style={styles.content_right}>
              {/** Component */}
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:component'}
                />
                <CText
                  styles={'textMeta fontRegular'}
                  customLabel={dataDetail?.componentName || '-'}
                />
              </View>

              {/** Piority */}
              <View style={[cStyles.row, cStyles.itemsStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:piority'}
                />
                <CText
                  customStyles={[
                    cStyles.textMeta,
                    cStyles.fontRegular,
                    {color: bgPriority},
                  ]}
                  customLabel={dataDetail?.priorityName || '-'}
                />
              </View>

              {/** Assignee */}
              <View
                style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:assignee'}
                />
                <CText
                  styles={'textMeta fontMedium'}
                  customLabel={dataDetail?.ownerName || '-'}
                />
              </View>
            </View>
          </View>
        }
        onClose={handleShowDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content_left: {flex: 0.5},
  content_right: {flex: 0.5},
  owner: {width: '60%'},
});

export default ListTask;

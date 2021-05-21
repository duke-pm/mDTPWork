/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Project Detail screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import ActionSheet from 'react-native-actions-sheet';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CButton from '~/components/CButton';
import ListTask from '../list/Task';
/* COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
import { cStyles } from '~/utils/style';
import {scalePx, sH} from '~/utils/helper';
import Commons from '~/utils/common/Commons';
/* REDUX */

const tasks = [
  {
    id: 1,
    label: 'Organize open source conference',
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'important',
    type: 'PHASE',
    status: 'In progress',
    startDate: '15/05/2021',
    endDate: '27/07/2021',
    assignee: 'Alison Becker',
    parent: null,
    childrens: [
      {
        id: 2,
        label: 'Set date and location of conference',
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'important',
        type: 'TASK',
        status: 'On hold',
        startDate: '15/05/2021',
        endDate: '31/05/2021',
        assignee: 'Wayne Rooney',
        parent: 1,
        childrens: [],
      },
      {
        id: 3,
        label: 'Invite attendees to conference',
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'important',
        type: 'TASK',
        status: 'New',
        startDate: '01/06/2021',
        endDate: '17/06/2021',
        assignee: 'Cristiano Ronaldo',
        parent: 1,
        childrens: [],
      },
    ],
  },
  {
    id: 4,
    label: 'Conference',
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'important',
    type: 'MILESTONE',
    status: 'Scheduled',
    startDate: '25/07/2021',
    endDate: '25/07/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [],
  },
  {
    id: 5,
    label: 'Follow-up tasks',
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'important',
    type: 'PHASE',
    status: 'To be scheduled',
    startDate: '26/07/2021',
    endDate: '11/08/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [
      {
        id: 6,
        label: 'Upload presentations to website',
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'important',
        type: 'TASK',
        status: 'New',
        startDate: '26/07/2021',
        endDate: '11/08/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
      },
      {
        id: 7,
        label: 'Invite attendees to conference',
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'important',
        type: 'TASK',
        status: 'New',
        startDate: '26/07/2021',
        endDate: '26/07/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
      },
      {
        id: 8,
        label: 'Invite attendees',
        grade: 'User',
        component: 'Conponnet',
        piority: 'important',
        type: 'TASK',
        status: 'Rejected',
        startDate: '26/07/2021',
        endDate: '26/07/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
      },
    ],
  },
  {
    id: 8,
    label: 'End of project',
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'important',
    type: 'MILESTONE',
    status: 'New',
    startDate: '12/08/2021',
    endDate: '12/08/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [],
  },
];
/** All refs use in this screen */
const actionSheetStatusRef = createRef();
const STATUS = [
  {
    value: Commons.STATUS_TASK.NEW.code,
    label: Commons.STATUS_TASK.NEW.name,
  },
  {
    value: Commons.STATUS_TASK.TO_BE_SCHEDULE.code,
    label: Commons.STATUS_TASK.TO_BE_SCHEDULE.name,
  },
  {
    value: Commons.STATUS_TASK.SCHEDULE.code,
    label: Commons.STATUS_TASK.SCHEDULE.name,
  },
  {
    value: Commons.STATUS_TASK.IN_PROCESS.code,
    label: Commons.STATUS_TASK.IN_PROCESS.name,
  },
  {
    value: Commons.STATUS_TASK.CLOSED.code,
    label: Commons.STATUS_TASK.CLOSED.name,
  },
  {
    value: Commons.STATUS_TASK.ON_HOLD.code,
    label: Commons.STATUS_TASK.ON_HOLD.name,
  },
  {
    value: Commons.STATUS_TASK.REJECTED.code,
    label: Commons.STATUS_TASK.REJECTED.name,
  },
];

function ProjectDetail(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const perPage = commonState.get('perPage');
  const formatDate = commonState.get('formatDate');

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    search: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    status: '1,2',
    tasks: [],
    page: 1,
  });
  const [status, setStatus] = useState({
    data: STATUS,
    active: 0,
  });

  /** HANDLE FUNC */
  const handleSearch = () => {};

  const handleChangeStatus = (index) => {
    let tasks = [...data.tasks];
    actionSheetStatusRef.current?.hide();
  };

  const handleShowChangeStatus = () => {
    actionSheetStatusRef.current?.show();
  };

  /** FUNC */
  const onChangeStatus = index => {
    setStatus({...status, active: index});
  };

  /** FUNC */
  const onFetchData = () => {
    onPrepareData();
  };

  const onPrepareData = () => {
    let isLoadmore = true;
    isLoadmore = false;

    setData({...data, tasks});

    setLoading({
      main: false,
      search: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  const onRefresh = () => {};

  const onLoadmore = () => {};

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
  }, []);

  /** RENDER */
  return (
    <CContainer
      loading={false}
      title={props.route.params?.data?.label || ''}
      subTitle={
        props.route.params?.data?.status === 1
          ? 'project_management:status_on_track'
          : 'project_management:status_pending'
      }
      header
      hasBack
      hasSearch
      onPressSearch={handleSearch}
      content={
        <CContent>
          {!loading.main &&
            <View style={[cStyles.flex1, cStyles.pt16]}>
              <ListTask
                refreshing={loading.refreshing}
                loadmore={loading.loadmore}
                data={data.tasks}
                customColors={customColors}
                isDark={isDark}
                onRefresh={onRefresh}
                onLoadmore={onLoadmore}
                onChangeStatus={handleShowChangeStatus}
              />
            </View>
          }

          <ActionSheet
            ref={actionSheetStatusRef}
            headerAlwaysVisible={true}
            elevation={2}
            indicatorColor={customColors.text}
            containerStyle={{
              backgroundColor: customColors.background,
              borderColor: customColors.card,
              borderWidth: 1,
            }}
            gestureEnabled={true}
            defaultOverlayOpacity={isDark ? 0.8 : 0.5}
            CustomHeaderComponent={
              <View
                style={[
                  cStyles.pt16,
                  cStyles.px16,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                  cStyles.roundedTopLeft2,
                  cStyles.roundedTopRight2,
                  {backgroundColor: customColors.background},
                ]}>
                <CText
                  styles={'textMeta'}
                  label={'project_management:holder_change_status'}
                />
                <CButton
                  label={'common:choose'}
                  onPress={() => handleChangeStatus(0)}
                />
              </View>
            }>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: scalePx(3)}}
              selectedValue={status.active}
              onValueChange={onChangeStatus}>
              {status.data.map((value, i) => (
                <Picker.Item label={value.label} value={i} key={i} />
              ))}
            </Picker>
          </ActionSheet>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: sH('25%')},
});

export default ProjectDetail;

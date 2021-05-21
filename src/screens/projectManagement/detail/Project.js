/**
 ** Name: Project Detail screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
 import React, {useState, useEffect} from 'react';
 import {useSelector, useDispatch} from 'react-redux';
 import {useTranslation} from 'react-i18next';
 import {View} from 'react-native';
 import {showMessage} from 'react-native-flash-message';
 import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListTask from '../list/Task';
/* COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
import { cStyles } from '~/utils/style';
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

function ProjectDetail(props) {
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

  /** HANDLE FUNC */
  const handleSearch = () => {};

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
                onRefresh={onRefresh}
                onLoadmore={onLoadmore}
              />
            </View>
          }
        </CContent>
      }
    />
  );
}

export default ProjectDetail;

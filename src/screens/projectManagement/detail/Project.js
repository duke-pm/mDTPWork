/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Detail screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListTask from '../list/Task';
import FilterTask from '../components/FilterTask';
/* COMMON */
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';

const tasks = [
  {
    id: 1,
    label:
      'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'High',
    type: 'PHASE',
    status: 'In Progress',
    startDate: '15/05/2021',
    endDate: '27/07/2021',
    assignee: 'Alison Becker',
    parent: null,
    childrens: [
      {
        id: 2,
        label: 'Set date and location of conference',
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'High',
        type: 'TASK',
        status: 'On Hold',
        startDate: '15/05/2021',
        endDate: '18/05/2021',
        assignee: 'Wayne Rooney',
        parent: 1,
        childrens: [],
        project: 'Project 2 - App Development',
      },
      {
        id: 3,
        label: 'Invite attendees to conference',
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        grade: 'Admin',
        component: 'Conponnet',
        piority: 'Low',
        type: 'TASK',
        status: 'New',
        startDate: '01/06/2021',
        endDate: '17/06/2021',
        assignee: 'Cristiano Ronaldo',
        parent: 1,
        childrens: [],
        project: 'Project 2 - App Development',
      },
    ],
    project: 'Project 2 - App Development',
  },
  {
    id: 4,
    label: 'Conference',
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",

    grade: 'Admin',
    component: 'Conponnet',
    piority: 'Nomal',
    type: 'MILESTONE',
    status: 'Scheduled',
    startDate: '25/07/2021',
    endDate: '25/07/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [],
    project: 'Project 2 - App Development',
  },
  {
    id: 5,
    label: 'Follow-up tasks',
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'High',
    type: 'PHASE',
    status: 'To Be Schedule',
    startDate: '26/07/2021',
    endDate: '11/08/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [
      {
        id: 6,
        label: 'Upload presentations to website',
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",

        grade: 'Admin',
        component: 'Conponnet',
        piority: 'High',
        type: 'TASK',
        status: 'New',
        startDate: '26/07/2021',
        endDate: '11/08/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
        project: 'Project 2 - App Development',
      },
      {
        id: 7,
        label: 'Invite attendees to conference',
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",

        grade: 'Admin',
        component: 'Conponnet',
        piority: 'High',
        type: 'TASK',
        status: 'New',
        startDate: '26/07/2021',
        endDate: '26/07/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
        project: 'Project 2 - App Development',
      },
      {
        id: 8,
        label: 'Invite attendees',
        description:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        grade: 'User',
        component: 'Conponnet',
        piority: 'High',
        type: 'TASK',
        status: 'Rejected',
        startDate: '26/07/2021',
        endDate: '26/07/2021',
        assignee: 'Wayne Rooney',
        parent: 5,
        childrens: [],
        project: 'Project 2 - App Development',
      },
    ],
    project: 'Project 2 - App Development',
  },
  {
    id: 8,
    label: 'End of project',
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    grade: 'Admin',
    component: 'Conponnet',
    piority: 'Low',
    type: 'MILESTONE',
    status: 'New',
    startDate: '12/08/2021',
    endDate: '12/08/2021',
    assignee: 'David de Gea',
    parent: null,
    childrens: [],
    project: 'Project 2 - App Development',
  },
];

function ProjectDetail(props) {
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

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
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState({
    fromDate: moment().clone().startOf('month').format(formatDate),
    toDate: moment().clone().endOf('month').format(formatDate),
    status: '1,2',
    tasks: [],
    page: 1,
  });

  /** HANDLE FUNC */
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
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
      headerRight={
        <TouchableOpacity style={cStyles.itemsEnd} onPress={handleShowFilter}>
          <Icon
            style={cStyles.p16}
            name={'filter'}
            color={'white'}
            size={scalePx(3)}
          />
        </TouchableOpacity>
      }
      content={
        <CContent>
          {!loading.main && (
            <View style={[cStyles.flex1, cStyles.pt16]}>
              <ListTask
                refreshing={loading.refreshing}
                loadmore={loading.loadmore}
                data={data.tasks}
                customColors={customColors}
                isDark={isDark}
                onRefresh={onRefresh}
                onLoadmore={onLoadmore}
              />
            </View>
          )}
          <FilterTask show={showFilter} onFilter={handleFilter} />
        </CContent>
      }
    />
  );
}

export default ProjectDetail;

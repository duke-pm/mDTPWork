/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Detail screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Project.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListTask from '../list/Task';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectDetail(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const projectID = route.params.data.projectID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const statusMaster = masterState.get('projectStatus');

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    search: false,
    refreshing: false,
    startFetch: false,
  });
  const [data, setData] = useState({
    tasks: [],
    tasksFilter: [],
    search: '',
  });

  /** HANDLE FUNC */
  const handleSearch = value => {
    setLoading({...loading, search: true});
    setData({...data, search: value});
    onFetchData(value);
  };

  /** FUNC */
  const onFetchData = (search = '') => {
    let params = fromJS({
      PrjID: projectID,
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListTask(params, navigation));
  };

  const onPrepareData = () => {
    /** Prepare data tasks */
    let tasks = projectState.get('tasks');

    /** set color code of status to task */
    if (tasks.length > 0) {
      let taskStatus = statusMaster,
        task = null,
        find = null;
      for (task of tasks) {
        find = taskStatus.find(f => f.statusID === task.statusID);
        if (find) {
          task.statusColor = find.colorCode;
        } else {
          task.statusColor = null;
        }
      }
    }

    setData({...data, tasks, tasksFilter: tasks});

    return setLoading({
      main: false,
      search: false,
      refreshing: false,
      startFetch: false,
    });
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({
      main: false,
      search: false,
      refreshing: false,
      startFetch: false,
    });
  };

  const onRefreshTasks = () => {
    if (!loading.refreshing) {
      setLoading({...loading, refreshing: true});
      onFetchData();
    }
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
    setLoading({...loading, startFetch: true});
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.search || loading.refreshing) {
      if (!projectState.get('submittingListTask')) {
        if (projectState.get('successListTask')) {
          console.log('[LOG] === onPrepareData ===> ');
          return onPrepareData();
        }

        if (projectState.get('errorListTask')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.search,
    loading.refreshing,
    projectState.get('submittingListTask'),
    projectState.get('successListTask'),
    projectState.get('errorListTask'),
  ]);

  /** RENDER */
  return (
    <CContainer
      loading={loading.main || loading.search}
      title={props.route.params?.data?.projectName || ''}
      subTitle={props.route.params?.data?.projectStatus}
      header
      hasBack
      hasSearch
      onPressSearch={handleSearch}
      content={
        <CContent>
          {!loading.main && !loading.search && (
            <ListTask
              refreshing={loading.refreshing}
              data={data.tasksFilter}
              onRefreshTasks={onRefreshTasks}
            />
          )}
        </CContent>
      }
    />
  );
}

export default ProjectDetail;

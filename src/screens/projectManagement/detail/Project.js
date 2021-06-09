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
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListTask from '../list/Task';
import FilterTask from '../components/FilterTask';
/* COMMON */
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectDetail(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const projectID = route.params.data.projectID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState({
    main: false,
    search: false,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
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

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  /** FUNC */
  const onFetchData = (search = '') => {
    let params = fromJS({
      PrjID: projectID,
      Search: search,
      Lang: language,
    });
    dispatch(Actions.fetchListTask(params, navigation));
  };

  const onPrepareData = () => {
    /** Prepare data tasks */
    let tasks = projectState.get('tasks');

    /** set color code of status to task */
    if (tasks.length > 0) {
      let taskStatus = masterState.get('projectStatus'),
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

    setData({
      ...data,
      tasks,
      tasksFilter: tasks,
    });

    return setLoading({
      main: false,
      search: false,
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
    });
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
    setLoading({...loading, main: true});
  }, []);

  useEffect(() => {
    if (loading.main || loading.search) {
      if (!projectState.get('submittingListTask')) {
        if (projectState.get('successListTask')) {
          return onPrepareData();
        }

        if (projectState.get('errorListTask')) {
          return onError();
        }
      }
    }
  }, [
    loading.main,
    loading.search,
    projectState.get('submittingListTask'),
    projectState.get('successListTask'),
    projectState.get('errorListTask'),
  ]);

  /** RENDER */
  return (
    <CContainer
      loading={false}
      title={props.route.params?.data?.projectName || ''}
      subTitle={props.route.params?.data?.projectStatus}
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
          {isFiltering && (
            <View
              style={[
                cStyles.rounded2,
                cStyles.abs,
                styles.badge,
                cStyles.borderAll,
                isDark && cStyles.borderAllDark,
                {backgroundColor: customColors.red},
              ]}
            />
          )}
        </TouchableOpacity>
      }
      content={
        <CContent>
          {!loading.main && !loading.search && (
            <ListTask data={data.tasksFilter} />
          )}
          {!loading.main && !loading.search && (
            <FilterTask visible={showFilter} onFilter={handleFilter} />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  badge: {height: 10, width: 10, top: 16, right: 15},
});

export default ProjectDetail;

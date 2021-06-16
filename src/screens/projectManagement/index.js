/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Management screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
import {fromJS} from 'immutable';
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListProject from './list/Project';
import FilterProject from './components/FilterProject';
/** COMMON */
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectManagement(props) {
  const {t} = useTranslation();
  const {navigation} = props;
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    search: false,
    refreshing: false,
    startFetch: false,
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState({
    projects: [],
    projectsFilter: [],
    search: '',
  });
  const [filters, setFilters] = useState({
    status: [],
    owner: [],
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

  const handleFilter = (activeOwner, activeStatus) => {
    setShowFilter(!showFilter);
    setLoading({...loading, search: true});
    let projects = onFilter(data.projects, activeOwner, 'owner');
    projects = onFilter(projects, activeStatus, 'statusID');
    if (activeOwner.length === filters.owner.length) {
      if (activeStatus.length === filters.status.length) {
        if (isFiltering) {
          setIsFiltering(false);
        }
        projects = data.projects;
      } else {
        if (!isFiltering) {
          setIsFiltering(true);
        }
      }
    } else {
      if (!isFiltering) {
        setIsFiltering(true);
      }
    }
    setData({...data, projectsFilter: projects});
    setLoading({...loading, search: false});
  };

  /** FUNC */
  const onFetchData = (search = '') => {
    let params = fromJS({
      Search: search,
      RefreshToken: refreshToken,
      Lang: language,
    });
    dispatch(Actions.fetchListProject(params, navigation));
    let paramsMaster = {
      ListType: 'PrjStatus',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(paramsMaster, navigation));
  };

  const onPrepareData = () => {
    /** Prepare data projects */
    let projects = projectState.get('projects');

    if (projects.length > 0) {
      /** set color code of status to project */
      let projectStatus = masterState.get('projectStatus'),
        project = null,
        find = null;
      for (project of projects) {
        find = projectStatus.find(f => f.statusID === project.statusID);
        if (find) {
          project.statusColor = find.colorCode;
        } else {
          project.statusColor = null;
        }
      }
    }

    setData({
      ...data,
      projects,
      projectsFilter: projects,
    });

    /** Prepare data filter */
    if (projects.length > 0) {
      let status = onPrepareDataFilter(
        projects,
        filters.status,
        'status',
        'statusID',
        'statusName',
      );
      if (status.length > 0) {
        setFilters({...filters, status});
      }
      let owner = onPrepareDataFilter(
        projects,
        filters.owner,
        'owner',
        'owner',
        'ownerName',
      );
      if (owner.length > 0) {
        setFilters({...filters, owner});
      }
    }
    return setLoading({
      main: false,
      search: false,
      refreshing: false,
      startFetch: false,
    });
  };

  const onPrepareDataFilter = (
    dataOrigin,
    dataFirst,
    slugFilter,
    valueFilter,
    labelFilter,
  ) => {
    let tmp = dataFirst,
      project = null;
    for (project of dataOrigin) {
      let find = tmp.find(f => f.value === project[valueFilter]);
      if (!find) {
        let item = {
          value: project[valueFilter],
          label: project[labelFilter],
        };
        tmp.push(item);
      }
      if (project.lstProjectItem.length > 0) {
        onPrepareDataFilter(
          project.lstProjectItem,
          tmp,
          slugFilter,
          valueFilter,
          labelFilter,
        );
      }
    }
    return tmp;
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

  const onFilter = (projects, arrFilter, valueFilter) => {
    let find = false,
      array = [],
      item = null;
    for (item of projects) {
      find = false;
      if (!find) {
        let tmp = arrFilter.findIndex(f => f === item[valueFilter]);
        if (tmp !== -1) {
          find = true;
        }
        if (!find && item.lstProjectItem.length > 0) {
          let tmp2 = onFilter(item.lstProjectItem, arrFilter, valueFilter);
          if (tmp2.length > 0) {
            find = true;
          }
        }
        if (find) {
          array.push(item);
        }
      }
    }
    return array;
  };

  const onRefresh = () => {
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
      if (!projectState.get('submittingListProject')) {
        if (projectState.get('successListProject')) {
          if (masterState.get('projectStatus').length > 0) {
            return onPrepareData();
          }
        }

        if (projectState.get('errorListProject')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.search,
    loading.refreshing,
    projectState.get('submittingListProject'),
    projectState.get('successListProject'),
    projectState.get('errorListProject'),
    masterState.get('projectStatus'),
  ]);

  /** RENDER */
  return (
    <CContainer
      loading={loading.main || loading.search}
      title={'project_management:title'}
      subTitle={`${projectState.get('countProjects')} ${t(
        'project_management:project',
      )}`}
      header
      hasBack
      hasSearch
      onPressSearch={handleSearch}
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
            <ListProject
              refreshing={loading.refreshing}
              data={data.projectsFilter}
              onRefresh={onRefresh}
            />
          )}
          {!loading.main && !loading.search && (
            <FilterProject
              visible={showFilter}
              data={filters}
              onFilter={handleFilter}
            />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  badge: {height: 10, width: 10, top: 16, right: 15},
});

export default ProjectManagement;

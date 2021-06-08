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
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Feather';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListProject from './list/Project';
import FilterProject from './components/FilterProject';
/** COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

function ProjectManagement(props) {
  const {t} = useTranslation();
  const {navigation} = props;

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
    let projects = onFilter([...data.projects], activeOwner, 'owner');
    if (activeOwner.length === filters.owner.length) {
      projects = data.projects;
    }
    setData({...data, projectsFilter: projects});
    setLoading({...loading, search: false});
  };

  /** FUNC */
  const onFetchData = (search = '') => {
    let params = fromJS({
      Lang: language,
      Search: search,
    });
    dispatch(Actions.fetchListProject(params, navigation));
    let paramsMaster = {
      ListType: 'PrjStatus',
    };
    dispatch(Actions.fetchMasterData(paramsMaster, navigation));
  };

  const onPrepareData = type => {
    /** Prepare data projects */
    let tmpProjects = [...data.projects];
    let projects = projectState.get('projects');
    if (type === REFRESH) {
      tmpProjects = projects;
    } else if (type === LOAD_MORE) {
      tmpProjects = [...tmpProjects, ...projects];
    }

    /** set color code of status to project */
    let projectStatus = masterState.get('projectStatus'),
      project = null,
      find = null;
    for (project of projects) {
      find = projectStatus.find(f => f.statusID === project.statusID);
      if (find) {
        project.statusColor = find.colorCode;
      }
    }

    setData({
      ...data,
      projects: tmpProjects,
      projectsFilter: tmpProjects,
    });

    /** Prepare data filter */
    if (tmpProjects.length > 0) {
      let status = onPrepareDataFilter(
        tmpProjects,
        filters.status,
        'status',
        'statusID',
        'statusName',
      );
      if (status.length > 0) {
        setFilters({...filters, status});
      }
      let owner = onPrepareDataFilter(
        tmpProjects,
        filters.owner,
        'owner',
        'owner',
        'ownerName',
      );
      if (owner.length > 0) {
        setFilters({...filters, owner});
      }
    }

    setLoading({
      main: false,
      search: false,
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
    });
  };

  const onFilter = (projects, arrFilter, valueFilter) => {
    let tmp = [],
      project = null;
    console.log('[LOG] === projects ===> ', projects);
    for (project of projects) {
      let find = arrFilter.indexOf(project[valueFilter]);
      if (find !== -1) {
        tmp.push(project);
      }
      if (project.lstProjectItem.length > 0) {
        onFilter(project.lstProjectItem, arrFilter, valueFilter);
      }
    }
    return tmp;
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
    setLoading({...loading, main: true});
  }, []);

  useEffect(() => {
    if (loading.main || loading.search) {
      if (!projectState.get('submittingListProject')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (projectState.get('successListProject')) {
          if (masterState.get('projectStatus').length > 0) {
            return onPrepareData(type);
          }
        }

        if (projectState.get('errorListProject')) {
          return onError();
        }
      }
    }
  }, [
    loading.main,
    loading.search,
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
        </TouchableOpacity>
      }
      content={
        <CContent>
          {!loading.main && !loading.search && (
            <ListProject data={data.projectsFilter} showScrollTop={false} />
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

export default ProjectManagement;

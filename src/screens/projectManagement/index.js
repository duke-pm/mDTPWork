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
/** COMMON */
import {LOAD_MORE, REFRESH} from '~/config/constants';
import {cStyles} from '~/utils/style';
/** REDUX */
import * as Actions from '~/redux/actions';
import { scalePx } from '~/utils/helper';
import FilterProject from './components/FilterProject';

function ProjectManagement(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
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
    search: '',
  });

  /** HANDLE FUNC */
  const handleSearch = value => {
    setLoading({...loading, search: true});
    setData({...data, search: value});
    onFetchData(value);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  /** FUNC */
  const onFetchData = (search = '') => {
    let params = fromJS({
      Lang: language,
      Search: search,
    });
    dispatch(Actions.fetchListProject(params, navigation));
  };

  const onPrepareData = type => {
    let tmpProjects = [...data.projects];
    if (type === REFRESH) {
      tmpProjects = projectState.get('projects');
    } else if (type === LOAD_MORE) {
      tmpProjects = [...tmpProjects, ...projectState.get('projects')];
    }
    setData({
      ...data,
      projects: tmpProjects,
    });
    setLoading({
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
      if (!projectState.get('submittingListProject')) {
        let type = REFRESH;
        if (loading.loadmore) {
          type = LOAD_MORE;
        }

        if (projectState.get('successListProject')) {
          return onPrepareData(type);
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
      // headerRight={
      //   <TouchableOpacity style={cStyles.itemsEnd} onPress={handleFilter}>
      //     <Icon
      //       style={cStyles.p16}
      //       name={'filter'}
      //       color={'white'}
      //       size={scalePx(3)}
      //     />
      //   </TouchableOpacity>
      // }
      content={
        <CContent>
          {!loading.main && !loading.search && (
            <ListProject data={data.projects} showScrollTop />
          )}
        </CContent>
      }
    />
  );
}

export default ProjectManagement;

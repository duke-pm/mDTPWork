/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Management screen
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import ListProject from './list/Project';
import FilterProject from './components/FilterProject';
import { cStyles } from '~/utils/style';
import { scalePx } from '~/utils/helper';

const projects = [
  {
    id: 1,
    label: 'Project 1 - Web Development',
    description: 'Project 1 for Web Development',
    sector: 'HCM',
    status: 1,
    public: true,
    dateCreated: '10/10/2021',
  },
  {
    id: 2,
    label: 'Project 2 - App Development',
    description: 'Project 2 for App Development',
    sector: 'Mekong',
    status: 1,
    public: true,
    dateCreated: '15/10/2021',
  },
  {
    id: 3,
    label: 'Project 3 - Book Store',
    description: 'Project 3 for Book Store',
    sector: 'HN',
    status: 2,
    public: false,
    dateCreated: '09/09/2021',
  },
];

function ProjectManagement(props) {
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
    projects: [],
    page: 1,
  });

  /** HANDLE FUNC */
  const handleSearch = value => {};

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

    setData({...data, projects});

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
          {!loading.main && (
            <ListProject
              refreshing={loading.refreshing}
              loadmore={loading.loadmore}
              data={data.projects}
              onRefresh={onRefresh}
              onLoadmore={onLoadmore}
            />
          )}
          <FilterProject show={showFilter} onFilter={handleFilter} />
        </CContent>
      }
    />
  );
}

export default ProjectManagement;

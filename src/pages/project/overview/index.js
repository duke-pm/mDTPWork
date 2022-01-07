/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: ProjectOverview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectOverview.js
 **/
import {fromJS} from 'immutable';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useTheme, List, Text} from '@ui-kitten/components';
import {StyleSheet, ScrollView, View} from 'react-native';
// import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import 'moment/locale/en-sg';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CLoading from '~/components/CLoading';
import BodyOverview from '../components/BodyOverview';
import Filter from '../components/Filter';
/** COMMON */
import Configs from '~/configs';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import {
  FIRST_CELL_WIDTH_LARGE,
  CELL_HEIGHT,
  CELL_WIDTH,
} from '~/configs/constants';
/** REDUX */
import * as Actions from '~/redux/actions';
import CEmpty from '~/components/CEmpty';


const DATA_HEADER = [
  {
    width: CELL_WIDTH,
    name: 'Status',
    key: 'statusName',
  },
  {
    width: CELL_WIDTH,
    name: 'Durations',
    key: 'duration',
  },
  {
    width: CELL_WIDTH,
    name: 'Start Date',
    key: 'startDate',
  },
  {
    width: CELL_WIDTH,
    name: 'Finish Date',
    key: 'endDate',
  },
  {
    width: CELL_WIDTH,
    name: "Resource'Owner",
    key: 'ownerName',
  },
  {
    width: CELL_WIDTH,
    name: '% Completed',
    key: 'completedPercent',
  },
];

const FormatCell = React.memo(
  ({theme = {}, value = ''}) => {
    return (
      <View
        key={value}
        style={[
          cStyles.center,
          cStyles.px6,
          cStyles.borderLeft,
          cStyles.borderBottom,
          styles.cell,
          {
            backgroundColor: theme['color-primary-200'],
            borderLeftColor: theme['outline-color'],
            borderBottomColor: theme['outline-color'],
          },
        ]}>
        <Text style={cStyles.textCenter} category="s1">
          {value}
        </Text>
      </View>
    );
  },
);

const FormatHeader = React.memo(({t = {}, theme = {}, headerScroll = undefined}) => {
    let cols = [],
      item;
    for (item of DATA_HEADER) {
      cols.push(
        <FormatCell theme={theme} value={item.name}/>
      );
    }
    return (
      <View style={cStyles.row}>
        <View
          style={[
            cStyles.abs,
            cStyles.center,
            cStyles.borderLeft,
            cStyles.borderBottom,
            styles.first_cell,
            {
              backgroundColor: theme['color-primary-200'],
              borderLeftColor: theme['outline-color'],
              borderBottomColor: theme['outline-color'],
            },
          ]}>
          <Text style={cStyles.textCenter} category="s1">
            {t('project_overview:task_name')}
          </Text>
        </View>
        <ScrollView
          ref={headerScroll}
          contentContainerStyle={styles.row_header}
          horizontal
          scrollEnabled={false}
          scrollEventThrottle={16}
          removeClippedSubviews={IS_ANDROID}
          showsHorizontalScrollIndicator={false}>
          {cols}
        </ScrollView>
      </View>
    );
  },
);

function ProjectOverview(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** Use ref */
  let headerScroll = useRef(null);

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const masterState = useSelector(({masterData}) => masterData);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const perPageMaster = Configs.perPageProjectOverview;

  /** Use state */
  const [loading, setLoading] = useState({
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [data, setData] = useState({
    overview: [],
    render: [],
  });
  const [params, setParams] = useState({
    fromDate: null,
    toDate: null,
    year: moment().year(),
    ownerID: null,
    sectorID: null,
    statusID: null,
    perPage: perPageMaster,
    page: 1,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFilter = (
    year = moment().year(),
    // fromDate = '',
    // toDate = '',
    activeSector = [],
    activeOwner = [],
    activeStatus = [],
    toggle = () => null,
  ) => {
    toggle();
    setParams({
      ...params,
      // fromDate: fromDate !== '' ? year + '/' + fromDate : null,
      // toDate: toDate !== '' ? year + '/' + toDate : null,
      year,
      sectorID: activeSector,
      ownerID: activeOwner,
      statusID: activeStatus,
      page: 1,
    });
    onFetchData(
      year,
      null,
      null,
      activeSector,
      activeOwner,
      activeStatus,
      perPageMaster,
      1,
      '',
    );
    return setLoading({...loading, startFetch: true});
  };

  /**********
   ** FUNC **
   **********/
  const formatRowForSheet = section => section.item.render;

  const onRecursiveData = (currentData = [], newData = []) => {
    if (currentData.length > 0) {
      if (newData.length > 0) {
        let endData = currentData;
        let endData2 = [];
        let item1 = null,
          item2 = null;
        for (item1 of endData) {
          for (item2 of newData) {
            if (item2.codeParentID !== 'P0') {
              if (item1.codeID === item2.codeParentID) {
                item1.lstItemChild.push(item2);
              } else if (item1.lstItemChild.length > 0) {
                endData2 = onRecursiveData(item1.lstItemChild, [item2]);
                item1.lstItemChild = endData2;
              }
            } else {
              endData2.push(item2);
            }
          }
        }
        return endData;
      } else {
        return currentData;
      }
    } else {
      return newData;
    }
  };

  const onFetchMasterData = () => {
    let paramsMaster = {
      ListType: 'Users, PrjSector, PrjStatus',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(paramsMaster, navigation));
  };

  const onFetchData = (
    year = params.year,
    fromDate = null,
    toDate = null,
    sectorID = null,
    ownerID = null,
    statusID = null,
    perPage = params.perPage,
    page = params.page,
  ) => {
    let paramsFetch = fromJS({
      Year: year,
      FromDate: fromDate,
      ToDate: toDate,
      SectorID: sectorID,
      OwnerID: ownerID,
      StatusID: statusID,
      PageSize: perPage,
      PageNum: page,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchProjectOverview(paramsFetch, navigation));
  };

  const onPrepareData = () => {
    let tmpRender = [],
      tmpOverview = [],
      isLoadmore = true;

    // Prepare data overview
    let overview = projectState.get('overview');
    let pagesOverview = projectState.get('pagesOverview');

    // Check if count result < perPage => loadmore is unavailable
    if (params.page >= pagesOverview) {
      isLoadmore = false;
    }

    tmpOverview = onRecursiveData(data.overview, overview);
    if (isLoadmore) {
      let newPage = params.page + 1;
      setData({...data, overview: tmpOverview});
      setParams({...params, page: newPage});
      return onFetchData(
        params.year,
        params.fromDate,
        params.toDate,
        params.ownerID,
        params.sectorID,
        params.statusID,
        params.perPage,
        newPage,
      );
    }
    if (tmpOverview.length > 0) {
      tmpRender.push({
        key: 'body',
        render: (
          <BodyOverview
            formatDateView={formatDateView}
            dataHeader={DATA_HEADER}
            dataBody={tmpOverview}
            headerScroll={headerScroll}
          />
        ),
      });
    }
    setData({overview: tmpOverview, render: tmpRender});
    return onDone(isLoadmore);
  };

  const onRefreshOverview = () => {
    if (!loading.refreshing) {
      setData({render: [], overview: []});
      setParams({...params, page: 1});
      onFetchData(
        params.year,
        params.fromDate,
        params.toDate,
        params.ownerID,
        params.sectorID,
        params.statusID,
        params.perPage,
        1,
      );
      setLoading({...loading, refreshing: true, isLoadmore: true});
    }
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:list_request'),
      type: 'danger',
      icon: 'danger',
    });
    return onDone(false);
  };

  const onDone = isLoadmore => {
    return setLoading({
      startFetch: false,
      refreshing: false,
      loadmore: false,
      isLoadmore,
    });
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Force to Horizontal to see more fields */
    // Orientation.lockToLandscapeLeft();

    /** Prepare data body */
    onFetchMasterData();
    onFetchData();
    setLoading({...loading, startFetch: true});

    /** After done and quit this page => Force to Vertical */
    // return () => {
    //   Orientation.lockToPortrait();
    // };
  }, []);

  useEffect(() => {
    if (loading.startFetch || loading.refreshing || loading.loadmore) {
      if (!projectState.get('submittingOverview')) {
        if (projectState.get('successOverview')) {
          return onPrepareData();
        }
        if (projectState.get('errorOverview')) {
          return onError();
        }
      }
    }
  }, [
    loading.startFetch,
    loading.refreshing,
    loading.loadmore,
    projectState.get('submittingOverview'),
    projectState.get('successOverview'),
    projectState.get('errorOverview'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top', 'bottom']}
      headerComponent={
        <CTopNavigation
          title="project_overview:title"
          back
          borderBottom
          filter
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isYear={true}
                isSector={true}
                data={params}
                masterData={{
                  users: masterState.get('users'),
                  status: masterState.get('projectStatus'),
                  sectors: masterState.get('projectSector')
                }}
                onFilter={(year, activeSector, activeOwner, activeStatus) =>
                  handleFilter(year, activeSector, activeOwner, activeStatus, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {!loading.startFetch && data.render.length > 0 && (
        <FormatHeader
          t={t}
          theme={theme}
          headerScroll={headerScroll}
        />
      )}

      {!loading.startFetch && (
        <List
          style={cStyles.shadowListItem}
          data={data.render}
          renderItem={formatRowForSheet}
          keyExtractor={(item, index) => item.key + index.toString()}
          extraData={data.render}
          scrollEventThrottle={16}
          initialNumToRender={1000}
          removeClippedSubviews={IS_ANDROID}
          refreshing={loading.refreshing}
          onRefresh={onRefreshOverview}
          ListEmptyComponent={<CEmpty />}
        />
      )}
      <CLoading show={loading.startFetch} />
    </CContainer>
  );
}

const styles = StyleSheet.create({
  row_header: {paddingLeft: FIRST_CELL_WIDTH_LARGE},
  cell: {width: CELL_WIDTH, height: CELL_HEIGHT},
  first_cell: {width: FIRST_CELL_WIDTH_LARGE, height: CELL_HEIGHT},
});

export default ProjectOverview;

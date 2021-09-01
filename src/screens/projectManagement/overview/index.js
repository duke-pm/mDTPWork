/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: ProjectOverview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectOverview.js
 **/
import {fromJS} from 'immutable';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet, ScrollView, FlatList, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
/** COMPONENTS */
import CText from '~/components/CText';
import CIconHeader from '~/components/CIconHeader';
import CDateTimePicker from '~/components/CDateTimePicker';
import CLoading from '~/components/CLoading';
import BodyPreview from '../components/BodyPreview';
/** COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import Icons from '~/utils/common/Icons';
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {usePrevious} from '~/utils/hook';
import {
  THEME_DARK,
  FIRST_CELL_WIDTH_LARGE,
  CELL_HEIGHT,
  CELL_WIDTH,
} from '~/config/constants';
/** REDUX */
import * as Actions from '~/redux/actions';

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

const FormatCell = ({isDark = false, customColors = {}, value = ''}) => {
  return (
    <View
      key={value}
      style={[
        cStyles.center,
        cStyles.px6,
        cStyles.borderLeft,
        cStyles.borderBottom,
        isDark && cStyles.borderLeftDark,
        isDark && cStyles.borderBottomDark,
        styles.cell,
        {backgroundColor: customColors.teal},
      ]}>
      <CText
        customStyles={[
          cStyles.textCenter,
          cStyles.textCaption1,
          cStyles.fontBold,
          {color: colors.WHITE},
        ]}
        numberOfLines={1}
        customLabel={value}
      />
    </View>
  );
};

const FormatHeader = ({
  headerScroll = undefined,
  isDark = false,
  customColors = {},
}) => {
  let cols = [],
    item;
  for (item of DATA_HEADER) {
    cols.push(
      <FormatCell
        isDark={isDark}
        customColors={customColors}
        value={item.name}
      />,
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
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          styles.first_cell,
          {backgroundColor: customColors.teal},
        ]}>
        <CText
          customStyles={[
            cStyles.textCenter,
            cStyles.textCaption1,
            cStyles.fontBold,
            {color: colors.WHITE},
          ]}
          numberOfLines={1}
          label={'project_overview:task_name'}
        />
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
};

function ProjectOverview(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useTheme() === THEME_DARK;
  const {navigation} = props;

  /** Use ref */
  let headerScroll = useRef(null);

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const language = commonState.get('language');
  const formatDate = commonState.get('formatDate');
  const formatDateView = commonState.get('formatDateView');
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const perPageMaster = Configs.perPageProjectOverview;

  /** Use state */
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState({
    startFetch: false,
    refreshing: false,
    loadmore: false,
    isLoadmore: true,
  });
  const [showPicker, setShowPicker] = useState({
    status: false,
    active: null,
  });
  const [showFilter, setShowFilter] = useState({
    activeOwner: [],
    activeStatus: [],
    activeSector: [],
  });
  const [data, setData] = useState({
    overview: [],
    render: [],
  });
  const [params, setParams] = useState({
    fromDate: null,
    toDate: null,
    year: Configs.toDay.year(),
    ownerID: null,
    sectorID: null,
    statusID: null,
    perPage: perPageMaster,
    page: 1,
  });

  /** Use prev */
  let prevShowFilter = usePrevious(showFilter);
  let prevYear = usePrevious(params.year);
  let prevFromDate = usePrevious(params.fromDate);
  let prevToDate = usePrevious(params.toDate);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleShowFilter = () => {
    navigation.navigate(Routes.MAIN.PROJECT_OVERVIEW_FILTER.name, {
      activeYear: params.year,
      activeOwner: showFilter.activeOwner,
      activeStatus: showFilter.activeStatus,
      activeSector: showFilter.activeSector,
      onFilter: (year, from, to, actOwn, actSta, actSec) =>
        handleFilter(year, from, to, actOwn, actSta, actSec),
    });
  };

  const handleFilter = (
    year = Configs.toDay.year(),
    fromDate = '',
    toDate = '',
    activeOwner = [],
    activeStatus = [],
    activeSector = [],
  ) => {
    setParams({
      ...params,
      fromDate: fromDate !== '' ? year + '/' + fromDate : null,
      toDate: toDate !== '' ? year + '/' + toDate : null,
      year,
    });
    setShowFilter({activeOwner, activeStatus, activeSector});
  };

  /**********
   ** FUNC **
   **********/
  const formatRowForSheet = section => section.item.render;

  const onChangeDateRequest = (newDate, show) => {
    setShowPicker({...showPicker, status: show});
    if (newDate && showPicker.active) {
      setParams({
        ...params,
        [showPicker.active]: moment(newDate).format(formatDate),
      });
    }
  };

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
    ownerID = null,
    statusID = null,
    sectorID = null,
    perPage = params.perPage,
    page = params.page,
  ) => {
    let paramsFetch = fromJS({
      Year: year,
      FromDate: fromDate || null,
      ToDate: toDate || null,
      OwnerID: ownerID,
      StatusID: statusID,
      SectorID: sectorID,
      PageSize: perPage,
      PageNum: page,
      Lang: language,
      RefreshToken: refreshToken,
    });
    dispatch(Actions.fetchProjectOverview(paramsFetch, navigation));
    if (
      (ownerID !== null ||
        statusID !== null ||
        sectorID !== null ||
        year != Configs.toDay.year()) &&
      !isFiltering
    ) {
      setIsFiltering(true);
    } else if (
      ownerID === null &&
      statusID === null &&
      sectorID === null &&
      year == Configs.toDay.year() &&
      isFiltering
    ) {
      setIsFiltering(false);
    }
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
          <BodyPreview
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
    Orientation.lockToLandscapeLeft();

    /** Prepare data body */
    onFetchMasterData();
    onFetchData();
    setLoading({...loading, startFetch: true});

    /** After done and quit this page => Force to Vertical */
    return () => {
      Orientation.lockToPortrait();
    };
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

  useEffect(() => {
    if (prevShowFilter && prevYear) {
      if (!loading.startFetch) {
        if (
          prevShowFilter.activeOwner.join() === showFilter.activeOwner.join() &&
          prevShowFilter.activeStatus.join() ===
            showFilter.activeStatus.join() &&
          prevShowFilter.activeSector.join() ===
            showFilter.activeSector.join() &&
          prevYear === params.year &&
          prevFromDate === params.fromDate &&
          prevToDate === params.toDate
        ) {
          return;
        }
        if (params.year) {
          setData({overview: [], render: []});
          let tmp = {ownerID: null, statusID: null, sectorID: null};
          if (showFilter.activeOwner.length > 0) {
            tmp.ownerID = showFilter.activeOwner.join();
          }
          if (showFilter.activeStatus.length > 0) {
            tmp.statusID = showFilter.activeStatus.join();
          }
          if (showFilter.activeSector.length > 0) {
            tmp.sectorID = showFilter.activeSector.join();
          }
          onFetchData(
            params.year,
            params.fromDate,
            params.toDate,
            tmp.ownerID,
            tmp.statusID,
            tmp.sectorID,
            perPageMaster,
            1,
          );
          setLoading({...loading, startFetch: true});
          return setParams({
            ...params,
            ownerID: tmp.ownerID,
            statusID: tmp.statusID,
            sectorID: tmp.sectorID,
            page: 1,
          });
        }
      }
    }
  }, [
    loading.startFetch,
    prevYear,
    prevFromDate,
    prevToDate,
    prevShowFilter,
    params.year,
    params.fromDate,
    params.toDate,
    showFilter.activeOwner,
    showFilter.activeStatus,
    showFilter.activeSector,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: isFiltering,
              icon: Icons.filter,
              onPress: handleShowFilter,
            },
          ]}
        />
      ),
    });
  }, [navigation, isFiltering, params.year, showFilter]);

  /************
   ** RENDER **
   ************/
  return (
    <SafeAreaView style={cStyles.flex1} edges={['left', 'bottom']}>
      <View style={cStyles.flex1}>
        <FormatHeader
          isDark={isDark}
          customColors={customColors}
          headerScroll={headerScroll}
        />

        {!loading.startFetch && (
          <FlatList
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
          />
        )}

        <CLoading visible={loading.startFetch} />

        {/** Date Picker */}
        <CDateTimePicker
          show={showPicker.status}
          value={
            params[showPicker.active] === ''
              ? Configs.toDay.format(formatDate)
              : params[showPicker.active]
          }
          onChangeDate={onChangeDateRequest}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row_header: {paddingLeft: FIRST_CELL_WIDTH_LARGE},
  cell: {width: CELL_WIDTH, height: CELL_HEIGHT},
  first_cell: {width: FIRST_CELL_WIDTH_LARGE, height: CELL_HEIGHT},
});

export default ProjectOverview;

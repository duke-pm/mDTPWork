/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: List request page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of List.js
 **/
import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {TabView, Tab, Icon} from "@ui-kitten/components";
import {View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CButtonAdd from "~/components/CButtonAdd";
import Assets from "../assets";
import AssetsDamage from "../assetsDamage";
import AssetsLost from "../assetsLost";
import Filter from "../components/Filter";
/* COMMON */
import Routes from "~/navigator/Routes";
import {cStyles} from "~/utils/style";
import {Commons} from "~/utils/common";
/* REDUX */
import * as Actions from "~/redux/actions";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderAddIcon = props => (
  <Icon {...props} name="monitor-outline" />
);

const RenderDamageIcon = props => (
  <Icon {...props} name="flash-off-outline" />
);

const RenderLostIcon = props => (
  <Icon {...props} name="alert-triangle-outline" />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function ListRequestAll(props) {
  const {t} = useTranslation();
  const {route, navigation} = props;
  const havePermission =
    route.params?.permission?.write || false;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  const formatDate = commonState["formatDate"];

  /** Use state */
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {
      key: Commons.APPROVED_TYPE.ASSETS.value + "",
      title: t("list_request_assets:title_add"),
      fromDate: moment().clone().startOf("month").format(formatDate),
      toDate: moment().clone().endOf("month").format(formatDate),
      status: "1,2,3,4",
      type: Commons.APPROVED_TYPE.ASSETS.value + "",
      search: "",
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.DAMAGED.value + "",
      title: t("list_request_assets:title_damaged"),
      fromDate: moment().clone().startOf("month").format(formatDate),
      toDate: moment().clone().endOf("month").format(formatDate),
      status: "1,2,3,4",
      type: Commons.APPROVED_TYPE.DAMAGED.value + "",
      search: "",
      isRefresh: true,
    },
    {
      key: Commons.APPROVED_TYPE.LOST.value + "",
      title: t("list_request_assets:title_lost"),
      fromDate: moment().clone().startOf("month").format(formatDate),
      toDate: moment().clone().endOf("month").format(formatDate),
      status: "1,2,3,4",
      type: Commons.APPROVED_TYPE.LOST.value + "",
      search: "",
      isRefresh: true,
    },
  ]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleAddNew = () => {
    if (index === 1) {
      return navigation.navigate(
        Routes.ADD_APPROVED_LOST_DAMAGED.name,
        {
          type: Commons.APPROVED_TYPE.DAMAGED.value,
          onRefresh: () => onRefresh(index),
        });
    } else if (index === 2) {
      return navigation.navigate(
        Routes.ADD_APPROVED_LOST_DAMAGED.name,
        {
          type: Commons.APPROVED_TYPE.LOST.value,
          onRefresh: () => onRefresh(index),
        });
    } else {
      return navigation.navigate(
        Routes.ADD_APPROVED_ASSETS.name,
        {
          type: Commons.APPROVED_TYPE.ASSETS.value,
          onRefresh: () => onRefresh(index),
        });
    }
  };

  /**********
   ** FUNC **
   **********/
  const resetAllRequests = () => {
    return dispatch(Actions.resetAllApproved());
  };

  const shouldLoadComponent = (newIndex) => {
    return newIndex === index;
  };

  const onRefresh = idxRoute => {
    let tmpRoutes = [...routes];
    tmpRoutes[idxRoute] = {
      ...tmpRoutes[idxRoute],
      isRefresh: !tmpRoutes[idxRoute].isRefresh,
    };
    return setRoutes(tmpRoutes);
  };

  const onSearch = value => {
    let tmp = {search: value};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    return setRoutes(tmpRoutes);
  };

  const onFilter = (fromDate, toDate, status, type, toggle) => {
    toggle();
    let tmp = {fromDate, toDate, status, type};
    let tmpRoutes = [...routes];
    tmpRoutes[index] = {...tmpRoutes[index], ...tmp};
    return setRoutes(tmpRoutes);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    resetAllRequests();
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top", "bottom"]}
      headerComponent={
        <CTopNavigation
          title="list_request_assets:title"
          back
          searchFilter
          onSearch={onSearch}
          renderFilter={(propsF, toggleFilter) => 
            <View style={propsF.style}>
              <Filter
                isResolve={false}
                formatDate={formatDate}
                data={routes[index]}
                onFilter={(fromDate, toDate, status, type, isResolve) =>
                  onFilter(fromDate, toDate, status, type, toggleFilter)
                }
              />
            </View>
          }
        />
      }>
      {/** Content */}
      <TabView
        style={cStyles.flex1}
        shouldLoadComponent={shouldLoadComponent}
        selectedIndex={index}
        onSelect={setIndex}>
        <Tab title={t("list_request_assets:title_add")} icon={RenderAddIcon}>
          <Assets dataRoute={routes[index]} navigation={navigation} />
        </Tab>
        <Tab title={t("list_request_assets:title_damaged")} icon={RenderDamageIcon}>
          <AssetsDamage dataRoute={routes[index]} navigation={navigation} />
        </Tab>
        <Tab title={t("list_request_assets:title_lost")} icon={RenderLostIcon}>
          <AssetsLost dataRoute={routes[index]} navigation={navigation} />
        </Tab>
      </TabView>

      {/** If have permission => Add action will show */}
      <CButtonAdd show={havePermission} onPress={handleAddNew} />
    </CContainer>
  );
}

export default ListRequestAll;

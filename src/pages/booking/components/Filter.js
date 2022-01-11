/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {showMessage} from "react-native-flash-message";
import {Button, Datepicker, Divider, Icon, Text} from "@ui-kitten/components";
import {MomentDateService} from "@ui-kitten/moment";
import {StyleSheet, View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
import "moment/locale/en-sg";
/* COMPONENTS */
import CGroupFilter from "~/components/CGroupFilter";
/* COMMON */
import Configs from "~/configs";
import {cStyles} from "~/utils/style";
import {sW} from "~/utils/helper";
import {
  DEFAULT_FORMAT_DATE_1,
} from "~/configs/constants";

/** All init avriables */
const formatDateService = new MomentDateService("en-sg");

const RenderCalendarIcon = props => (
  <Icon {...props} name="calendar" />
);

function Filter(props) {
  const {t} = useTranslation();
  const {
    formatDate = DEFAULT_FORMAT_DATE_1,
    resourcesMaster = {},
    onFilter = () => {},
  } = props;

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [dataResources, setDataResources] = useState([]);
  const [data, setData] = useState({
    fromDate: props.data.fromDate,
    toDate: props.data.toDate,
    resources: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeResource = resourceChoosed =>
    setData({...data, resources: resourceChoosed});

  const handleReset = () => onPrepareData();

  const handleFilter = () => {
    let tmpFromDate =
      data.fromDate !== "" ? moment(data.fromDate, formatDate).valueOf() : null;
    let tmpToDate =
      data.toDate !== "" ? moment(data.toDate, formatDate).valueOf() : null;
    if (tmpFromDate && tmpToDate && tmpFromDate > tmpToDate) {
      return onErrorValidation("error:from_date_larger_than_to_date");
    }
    if (data.resources.length === 0) {
      return onErrorValidation("error:resource_not_found");
    }
    let tmpResourceORG = dataResources.filter(item =>
      data.resources.includes(item.value),
    );

    return onFilter(
      data.fromDate,
      data.toDate,
      data.resources.join(),
      tmpResourceORG,
    );
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = (fromDate = null, toDate = null) => {
    let i,
      objResource = {},
      tmpResurces = [],
      tmpDataResources = [];
    for (i = 0; i < resourcesMaster.length; i++) {
      tmpResurces.push(resourcesMaster[i].resourceID);
      objResource = {};
      objResource.value = resourcesMaster[i].resourceID;
      objResource.label = resourcesMaster[i].resourceName;
      tmpDataResources.push(objResource);
    }
    setDataResources(tmpDataResources);
    setData({
      fromDate: fromDate || props.data.fromDate,
      toDate: toDate || props.data.toDate,
      resources: tmpResurces,
    });
    setLoading(false);
  };

  const onErrorValidation = messageKey => {
    return showMessage({
      message: t("common:app_name"),
      description: t(messageKey),
      type: "warning",
      icon: "warning",
    });
  };

  const onChangeFromDate = newDate => {
    setData({...data, fromDate: newDate});
  };

  const onChangeToDate = newDate => {
    setData({...data, toDate: newDate});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loading && resourcesMaster.length > 0) {
      onPrepareData();
    }
  }, []);

  useEffect(() => {
    if (props.data) {
      let tmp = {
        fromDate: props.data.fromDate,
        toDate: props.data.toDate,
        resources: JSON.parse("[" + props.data.resources + "]"),
      };
      setData(tmp);
    }
  }, [props.data]);
  
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.pb20, styles.con_filter]}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.pb10,
          cStyles.pt5,
        ]}>
        <Text category="s1">{t("common:filter")}</Text>
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <Button
            appearance="outline"
            size="small"
            status="basic"
            onPress={handleReset}>
            {propsT =>
              <Text category="label">{t("common:reset")}</Text>
            }
          </Button>
          <Button
            style={cStyles.ml5}
            size="small"
            onPress={handleFilter}>
            {propsT =>
              <Text category="label" status="control">{t("common:apply")}</Text>
            }
          </Button>
        </View>
      </View>
      <Divider />
      <>
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween]}>
          <Datepicker
            style={cStyles.mt16}
            label={t("bookings:from_date")}
            accessoryRight={RenderCalendarIcon}
            dateService={formatDateService}
            placeholder={t("bookings:from_date")}
            date={data.fromDate === ""
              ? ""
              : moment(data.fromDate)}
            min={moment(Configs.minDate)}
            max={moment(Configs.maxDate)}
            onSelect={onChangeFromDate}
          />
          <Datepicker
            style={cStyles.mt16}
            label={t("bookings:to_date")}
            accessoryRight={RenderCalendarIcon}
            dateService={formatDateService}
            placeholder={t("bookings:to_date")}
            date={data.toDate === ""
              ? ""
              : moment(data.toDate)}
              min={moment(Configs.minDate)}
              max={moment(Configs.maxDate)}
            onSelect={onChangeToDate}
          />
        </View>

        {!loading &&
          <CGroupFilter
            label={"bookings:resource"}
            items={dataResources}
            itemsChoose={data.resources}
            primaryColor={"primary"}
            onChange={handleChangeResource}
          />
        }
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  con_filter: {width: sW("85%")},
});

Filter.propTypes = {
  data: PropTypes.object.isRequired,
  formatDate: PropTypes.string,
  resourcesMaster: PropTypes.object,
  onFilter: PropTypes.func.isRequired,
};

export default Filter;

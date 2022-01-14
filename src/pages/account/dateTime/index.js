/**
 ** Name: Format date - time
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {
  IndexPath, Menu, MenuItem, Card, Layout, Text,
} from "@ui-kitten/components";
import moment from "moment";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
/* COMMON */
import {cStyles} from "~/utils/style";
/* REDUX */
import * as Actions from "~/redux/actions";

const DATE_FORMAT = [
  {
    value: "DD MMM YY",
    label: "DD MMM YY",
  },
  {
    value: "DD/MM/YYYY",
    label: "DD/MM/YYYY",
  },
  {
    value: "MM/DD/YYYY",
    label: "MM/DD/YYYY",
  },
  {
    value: "YYYY/MM/DD",
    label: "YYYY/MM/DD",
  },
  {
    value: "DD-MM-YYYY",
    label: "DD-MM-YYYY",
  },
];
const TIME_FORMAT = [
  {
    value: "H:mm",
    label: "H:mm",
  },
  {
    value: "h:mm A",
    label: "h:mm A",
  },
  {
    value: "H:mm:ss",
    label: "H:mm:ss",
  },
];

const RenderValueSample = (props, format) => (
  <Text appearance="hint">{moment().format(format)}</Text>
);

function DateTime(props) {
  const {t} = useTranslation();
  const {navigation, route} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);

  /** Use state */
  const [loading, setLoading] = useState(true); 
  const [selectedDate, setSelectedDate] = useState(new IndexPath(0));
  const [selectedTime, setSelectedTime] = useState(new IndexPath(0));

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeDate = newSelected => {
    setSelectedDate(newSelected);
    dispatch(Actions.changeFormatDateView(DATE_FORMAT[newSelected.row]["value"]))
  };

  const handleChangeTime = newSelected => {
    setSelectedTime(newSelected);
    dispatch(Actions.changeFormatTimeView(TIME_FORMAT[newSelected.row]["value"]))
  };

  /**********
   ** FUNC **
   **********/
  const onBack = () => {
    if (route.params.onRefresh) {
      route.params.onRefresh();
    }
    navigation.goBack();
  };

  const onPrepareCommonData = () => {
    let formatDate = commonState["formatDateView"],
      formatTime = commonState["formatTimeView"];
    let fFormat = DATE_FORMAT.findIndex(f => f.value === formatDate);
    if (fFormat !== -1) {
      setSelectedDate(new IndexPath(fFormat));
    }
    fFormat = TIME_FORMAT.findIndex(f => f.value === formatTime);
    if (fFormat !== -1) {
      setSelectedTime(new IndexPath(fFormat));
    }
    setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onPrepareCommonData();
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top"]}
      loading={loading}
      headerComponent={
        <CTopNavigation
          title="date_time:title"
          back
          borderBottom
          onPressCustomBack={onBack}
        />
      }>
      <Layout style={cStyles.m10}>
        <Card
          disabled
          header={
            <Text category="s1">{t("date_time:holder_change_date")}</Text>
          }>
          <Menu
            selectedIndex={selectedDate}
            onSelect={handleChangeDate}>
            {DATE_FORMAT.map((itemD, indexD) => (
              <MenuItem
                key={itemD.value + "_" + indexD}
                title={itemD.label}
                accessoryRight={propsR =>
                  RenderValueSample(propsR, itemD.value)}
              />
            ))}
          </Menu>
        </Card>

        <Card
          style={cStyles.mt10}
          disabled
          header={
            <Text category="s1">{t("date_time:holder_change_time")}</Text>
          }>
          <Menu
            selectedIndex={selectedTime}
            onSelect={handleChangeTime}>
            {TIME_FORMAT.map((itemT, indexT) => (
              <MenuItem
                key={itemT.value + "_" + indexT}
                title={itemT.label}
                accessoryRight={propsR =>
                  RenderValueSample(propsR, itemT.value)}
              />
            ))}
          </Menu>
        </Card>
      </Layout>
    </CContainer>
  );
}

export default DateTime;

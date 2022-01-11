/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom Group Filter
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CGroupFilter.js
 **/
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Button, Layout, Text} from "@ui-kitten/components";
/* COMMON */
import {cStyles} from "~/utils/style";

let isCheck = null;

function CGroupFilter(props) {
  const {t} = useTranslation();
  const {
    containerStyle = {},
    label = "",
    items = [],
    itemsChoose = [],
    primaryColor = undefined,
    onChange = () => {},
  } = props;

  /** Use state */
  const [values] = useState(items);
  const [valuesChoose, setValuesChoose] = useState(items);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = (data) => {
    let tmpValues = [...valuesChoose];
    let fItem = tmpValues.findIndex(f => f.value == data.value);
    if (fItem !== -1) {
      tmpValues.splice(fItem, 1);
    } else {
      tmpValues.push(data);
    }
    setValuesChoose(tmpValues);
    let callback = tmpValues.map(item => item.value);
    onChange(callback);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (itemsChoose.length > 0) {
      let chooses = [],
        i = null,
        find = null;
      for (i of itemsChoose) {
        find = values.findIndex(f => f.value == i);
        if (find !== -1) {
          if (typeof i === "boolean") {
            if (i === true) {
              chooses.push(values[find]);
            }
          } else {
            chooses.push(values[find]);
          }
        } else if (typeof i === "boolean") {
          if (i === true) {
            let tmp = values[0];
            tmp.value = true;
            chooses.push(tmp);
          }
        }
      }
      setValuesChoose(chooses);
    }
  }, [itemsChoose]);

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={[cStyles.mt16, containerStyle]}>
      <Text category="label" appearance="hint">{t(label)}</Text>
      <Layout style={[cStyles.row, cStyles.itemsCenter, cStyles.flexWrap, cStyles.mt5]}>
        {values.map((item, index) => {
          isCheck = valuesChoose.find(f => f.value == item.value);
          return (
            <Layout
              key={item.value + "_" + item.index}
              style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
              <Button
                style={cStyles.mr4}
                appearance={isCheck ? "filled" : "outline"}
                status={primaryColor}
                size="small"
                onPress={() => handleItem(item)}>
                {t(item.label)}
              </Button>
            </Layout>
          );
        })}
      </Layout>
    </Layout>
  );
}

CGroupFilter.propTypes = {
  containerStyle: PropTypes.object,
  label: PropTypes.string,
  items: PropTypes.array,
  itemsChoose: PropTypes.array,
  primaryColor: PropTypes.string,
  onChange: PropTypes.func,
};

export default CGroupFilter;

/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Table of assets
** Author: DTP-Education
** CreateAt: 2021
** Description: Description of AssetsTable.js
**/
import PropTypes from "prop-types";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
  useTheme, Button, Icon, Text,
} from "@ui-kitten/components";
import {
  StyleSheet, ScrollView, View, UIManager, LayoutAnimation,
} from "react-native";
import {
  Table, Row, TableWrapper, Cell,
} from "react-native-table-component";
/* COMPONENTS */
import AssetItem from "./AssetItem";
/* COMMON */
import {cStyles} from "~/utils/style";
import {
  moderateScale,
  verticalScale,
  IS_ANDROID,
} from "~/utils/helper";

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const HEIGHT_ITEM_TABLE = IS_ANDROID 
  ? verticalScale(38)
  : verticalScale(30);
export const WIDTH_ITEM_TABLE = [
  moderateScale(35),
  moderateScale(220),
  moderateScale(80),
  moderateScale(120),
  moderateScale(120),
];
const colorBorderError = "border-danger-color-1";
const colorBorder = "color-basic-400";
const colorBgHeaderTable = "color-basic-300";
const colorHint = "text-hint-color";

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderAddIcon = props => (
  <Icon {...props} name="plus-circle-outline" />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function AssetsTable(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    style = {},
    loading = false,
    checking = false,
    isDetail = false,
    assets = {
      width: WIDTH_ITEM_TABLE,
      header: ["", "", "", "", ""],
      data: [],
    },
    onCallbackValidate = () => {},
  } = props;

  /** Use state */
  const [form, setForm] = useState({
    assets: {
      width: WIDTH_ITEM_TABLE,
      header: [
        "",
        t("add_approved_assets:description"),
        t("add_approved_assets:amount"),
        t("add_approved_assets:price"),
        t("add_approved_assets:total"),
      ],
      data: [[null, "", "", "", ""]],
    },
  });
  const [error, setError] = useState({
    status: false,
    helper: "",
  });

  /*****************
  ** HANDLE FUNC **
  *****************/
  const handleAddAssets = () => {
    if (error.status) {
      setError({status: false, helper: ""});
    }
    let newData = [...form.assets.data];
    newData.push([null, "", "", "", ""]);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return setForm({...form, assets: {...form.assets, data: newData}});
  };

  /**********
  ** FUNC **
  **********/
  const onChangeCellItem = (value, rowIdx, cellIdx) => {
    let newData = form.assets.data;
    newData[rowIdx][cellIdx] = value;
    if (newData[rowIdx][2] !== "") {
      if (newData[rowIdx][3] !== "") {
        newData[rowIdx][4] = JSON.stringify(
          Number(newData[rowIdx][2]) * Number(newData[rowIdx][3]),
        );
      } else {
        newData[rowIdx][4] = "";
      }
    } else {
      newData[rowIdx][4] = "";
    }
    setForm({...form, assets: {...form.assets, data: newData}});
    if (error.status) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return setError({status: false, helper: ""});
    }
  };

  const onRemoveRow = rowIdx => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (error.status) {
      setError({status: false, helper: ""});
    }
    let newData = [...form.assets.data];
    newData.splice(rowIdx, 1);
    return setForm({...form, assets: {...form.assets, data: newData}});
  };

  const onValidate = () => {
    setError({status: false, helper: ""});
    let tmpError = {status: false, helper: ""},
      item = null;
    if (form.assets.data.length > 0) {
      for (item of form.assets.data) {
        if (item[1].trim() === "") {
          tmpError.status = true;
          tmpError.helper = "error:not_enough_assets";
        } else {
          if (item[2] === "" || (item[2] !== "" && Number(item[2]) < 1)) {
            tmpError.status = true;
            tmpError.helper = "error:assets_need_larger_than_zero";
          }
        }
      }
    } else {
      tmpError.status = true;
      tmpError.helper = "error:not_enough_assets";
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setError(tmpError);
    return onCallbackValidate({status: tmpError.status, data: form.assets.data});
  };

  /****************
  ** LIFE CYCLE **
  ****************/
  useEffect(() => {
    if (assets) setForm({...form, assets: assets});
  }, [assets, setForm]);

  useEffect(() => {
    if (checking) onValidate();
  }, [checking]);

  /************
  ** RENDER **
  ************/
  return (
    <View style={[cStyles.flex1, style]}>
      <View style={cStyles.itemsCenter}>
        {!isDetail && form.assets.data.length === 0 && (
          <View style={cStyles.mt10}>
            <Button
              appearance="ghost"
              size="small"
              accessoryLeft={RenderAddIcon}
              onPress={handleAddAssets}>
              {propsB => (
                <Text style={cStyles.textUnderline} category="c1" status="primary">
                  {t("add_approved_assets:add_assets")}
                </Text>
              )}
            </Button>
          </View>
        )}
      </View>

      {form.assets.data.length > 0 && (
        <ScrollView horizontal keyboardShouldPersistTaps="handled">
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: error.status
                ? theme[colorBorderError]
                : theme[colorBorder],
            }}
            style={cStyles.mt6}>
            <Row
              style={[styles.table_header, {backgroundColor: theme[colorBgHeaderTable]}]}
              textStyle={[
                cStyles.textCenter,
                cStyles.fontBold,
                {
                  fontSize: 12,
                  color: theme[colorHint],
                },
              ]}
              widthArr={form.assets.width}
              data={form.assets.header}
            />
            {form.assets.data.map((rowData, rowIdx) => {
              return (
                <TableWrapper
                  key={"row_" + rowIdx}
                  style={[cStyles.flex1, cStyles.row]}>
                  {rowData.map((cellData, cellIdx) => {
                    let disabled = loading || cellIdx === 4 || isDetail;
                    return (
                      <Cell
                        key={"cell_" + cellIdx}
                        width={form.assets.width[cellIdx]}
                        data={
                          <AssetItem
                            isDetail={isDetail}
                            disabled={disabled}
                            cellData={cellData}
                            rowIndex={rowIdx}
                            cellIndex={cellIdx}
                            onChangeCellItem={onChangeCellItem}
                            onRemoveRow={onRemoveRow}
                          />
                        }
                      />
                    );
                  })}
                </TableWrapper>
              );
            })}
          </Table>
        </ScrollView>
      )}

      <View
        style={[
          cStyles.flex1,
          cStyles.row,
          cStyles.justifyBetween,
          cStyles.itemsCenter,
          cStyles.pt6,
        ]}>
        <View
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.pl16,
            styles.con_right,
          ]}>
          {error.status && (
            <Icon
              style={styles.icon_error}
              name={"alert-circle"}
              fill={theme[colorBorderError]}
            />
          )}
          {error.status && (
            <Text style={cStyles.pl5} category="c1" status="danger">
              {t(error.helper)}
            </Text>
          )}
        </View>

        {!isDetail && form.assets.data.length > 0 && (
          <View style={cStyles.mt10}>
            <Button
              appearance="ghost"
              size="small"
              accessoryLeft={RenderAddIcon}
              onPress={handleAddAssets}>
              {propsB => (
                <Text style={cStyles.textUnderline} category="c1" status="primary">
                  {t("add_approved_assets:add_assets")}
                </Text>
              )}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  table_header: {
    height: HEIGHT_ITEM_TABLE,
  },
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
  icon_error: {
    height: moderateScale(16),
    width: moderateScale(16),
  },
});

AssetsTable.propTypes = {
  loading: PropTypes.bool,
  checking: PropTypes.bool,
  isDetail: PropTypes.bool,
  assets: PropTypes.object,
  onCallbackValidate: PropTypes.func,
};

export default AssetsTable;

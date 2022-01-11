/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: FilterTags
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: All tags of filter requests
 **/
import PropTypes from "prop-types";
import React, {createRef, useState, useEffect} from "react";
import {Button, Icon, Layout, useTheme, Text} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
import moment from "moment";
import "moment/locale/en-sg";
/* COMMON */
import Icons from "~/utils/common/Icons";
import {colors, cStyles} from "~/utils/style";
import {moderateScale, verticalScale} from "~/utils/helper";

/** All ref */
const asResourceRef = createRef();

/** All init */
const TXT_AS_SIZE = moderateScale(18);

const RenderCloseIcon = props => (
  <Icon {...props} name="close-circle-outline" />
);

const RenderChangeIcon = props => (
  <Icon {...props} name="repeat-outline" />
);

function FilterTags(props) {
  const theme = useTheme();
  const {
    resourcesMaster = [],
    resource = {}, // for filter by 1 resource
    resources = [], // for filter by some resource
    trans = () => null,
    onChangeReSrc = () => null,
    onPressRemoveReSrc = () => null,
  } = props;

  /** use states */
  const [dataResources, setDataResources] = useState(resourcesMaster);
  const [findResource, setFindResource] = useState("");
  const [reSrc, setReSrc] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleResource = () => asResourceRef.current?.show();

  const handleChangeResource = () => {
    let tmpResource = null;
    if (findResource === "") {
      tmpResource = dataResources[reSrc];
    } else {
      if (dataResources.length > 0) {
        tmpResource = dataResources[reSrc];
      }
    }
    if (tmpResource) {
      onChangeReSrc(tmpResource);
    }
    asResourceRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onChangeResource = index => setReSrc(index);

  const onSearchResources = text => {
    if (text) {
      const newData = dataResources.filter(function (item) {
        const itemData = item.resourceName
          ? item.resourceName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataResources(newData);
      setFindResource(text);
      if (newData.length > 0) {
        setReSrc(0);
      }
    } else {
      setDataResources(resourcesMaster);
      setFindResource(text);
      setReSrc(0);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (resource.id && resourcesMaster.length > 0) {
      let findResrc = resourcesMaster.findIndex(
        f => f.resourceID === resource.id,
      );
      if (findResrc !== -1) {
        setReSrc(findResrc);
      }
    }
  }, [resource.id]);

  /************
   ** RENDER **
   ************/
  if (!resource.id) return null;
  return (
    <View
      style={[
        cStyles.flexWrap,
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.px6,
        cStyles.pt10,
        cStyles.pb6,
      ]}>
      {resource.id && (
        <Layout
          style={[
            cStyles.p6,
            cStyles.mx4,
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
          ]}>
          <Text style={cStyles.ml5}>{resource.name}</Text>
          <Button
            style={cStyles.ml5}
            appearance="ghost"
            size="small"
            status="primary"
            accessoryLeft={RenderChangeIcon}
            onPress={handleResource}
          />
          <Button
            appearance="ghost"
            size="small"
            status="danger"
            accessoryLeft={RenderCloseIcon}
            onPress={onPressRemoveReSrc}
          />
        </Layout>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  action: {height: verticalScale(180)},
  content_picker: {height: "40%"},
});

FilterTags.propTypes = {
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  search: PropTypes.string,
  resourcesMaster: PropTypes.array,
  resource: PropTypes.any,
  resources: PropTypes.array,
  trans: PropTypes.func,
  onChangeReSrc: PropTypes.func,
  onPressRemoveReSrc: PropTypes.func,
};

export default FilterTags;

/**
 ** Name: Custom Avatar
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvatar.js
 **/
import PropTypes from "prop-types";
import React, {useState} from "react";
import {
  useTheme, Layout, Avatar, Text,
} from "@ui-kitten/components";
import {
  StyleSheet, ScrollView, TouchableOpacity, View,
} from "react-native";
/** COMPONENTS */
import CAlert from "./CAlert";
/* COMMON */
import {Assets} from "~/utils/asset";
import {cStyles} from "~/utils/style";
import {
  moderateScale,
} from "~/utils/helper";

/** All init */
const SIZE = {
  THIN: "thin",
  TINY: "tiny",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  GIANT: "giant",
};
const borderColor = "border-basic-color-3";
const colorBgAlert = "background-basic-color-2";

function CAvatar(props) {
  const theme = useTheme();
  const {
    style = {},
    numberShow = 3,
    absolute = true,
    size = "large",
    shape = "round",
    sources = [],
    source = null,
    details = [],
  } = props;

  /** Use state */
  const [showDetails, setShowDetails] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  /************
   ** RENDER **
   ************/
  let holderSize = {},
    borderRadiusHolder = {};
  switch (size) {
    case SIZE.TINY:
      holderSize = styles.img_tiny;
      borderRadiusHolder = cStyles.rounded5;
      break;
    case SIZE.SMALL:
      holderSize = styles.img_small;
      borderRadiusHolder = cStyles.rounded6;
      break;
    case SIZE.LARGE:
      holderSize = styles.img_large;
      borderRadiusHolder = cStyles.rounded10;
      break;
    case SIZE.GIANT:
      holderSize = styles.img_giant;
      borderRadiusHolder = cStyles.rounded10;
      break;
    default:
      holderSize = styles.img_medium;
      break;
  }
  
  if (sources.length === 0 && source) {
    return (
      <Avatar
        style={[cStyles.borderAll, {borderColor: theme[borderColor]}]}
        size={size}
        shape={shape}
        source={typeof source === "string"
          ? {uri: source}
          : source
        }
      />
    );
  }
  if (sources.length > 0) {
    return (
      <>
        <TouchableOpacity
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            style,
          ]}
          onPress={toggleShowDetails}>
          {sources.map((itemA, indexA) => {
            if (indexA > numberShow) return null;
            if (indexA === numberShow) {
              return (
                <Layout
                  key={"avatar_holder_" + indexA}
                  style={[
                    cStyles.center,
                    holderSize,
                    borderRadiusHolder,
                    cStyles.borderAll,
                    {borderColor: theme[borderColor]},
                    absolute && cStyles.abs,
                    absolute && {left: indexA * 15},
                  ]}
                  level="3">
                  <Text category="c1" numberOfLines={1}>
                    {`+${sources.length - numberShow}`}
                  </Text>
                </Layout>
              )
            }
            return (
              <Avatar
                key={"avatar_" + indexA}
                style={[
                  absolute && cStyles.abs,
                  absolute && {left: indexA * 15},
                  cStyles.borderAll,
                  {borderColor: theme[borderColor]},
                ]}
                size={size}
                shape={shape}
                source={typeof itemA === "string"
                  ? {uri: itemA}
                  : itemA
                }
              />
            )
          })}
        </TouchableOpacity>

        <CAlert
          show={showDetails}
          label={"project_management:user_invited"}
          cancel
          customMessage={
            <ScrollView
              style={[
                cStyles.mt10,
                cStyles.rounded1,
                cStyles.borderAll,
                {
                  backgroundColor: theme[colorBgAlert],
                  borderColor: theme[borderColor],
                },
                styles.list_invited,
              ]}>
              {details.map((itemU, indexU) => {
                return (
                  <View
                    key={itemU.userName + "_" + indexU}
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.ml3]}>
                    <View style={cStyles.px10}>
                      <Avatar size="small" source={Assets.iconUser} />
                    </View>
                    <View
                      style={[
                        cStyles.ml5,
                        cStyles.py10,
                        cStyles.flex1,
                      ]}>
                      <Text>{itemU.fullName}</Text>
                      <Text style={cStyles.mt3} category="c1" appearance="hint">
                        {itemU.email}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          }
          onCancel={toggleShowDetails}
          onBackdrop={toggleShowDetails}
        />
      </>
    )
  }
  return null;
}

const styles = StyleSheet.create({
  img_tiny: {height: 24, width: 24},
  img_small: {height: 32, width: 32},
  img_medium: {height: 40, width: 40},
  img_large: {height: 48, width: 48},
  img_giant: {height: 56, width: 56},

  con_group_avatar: {height: 42, width: 42},
  con_holder_avatar: {height: 18, width: 18},
  list_invited: {maxHeight: moderateScale(180)},
});

CAvatar.propTypes = {
  style: PropTypes.object,
  numberShow: PropTypes.number,
  absolute: PropTypes.bool,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "giant"]),
  shape: PropTypes.oneOf(["round", "rounded", "square"]),
  sources: PropTypes.array,
  source: PropTypes.object,
  details: PropTypes.array,
};

export default CAvatar;

/**
 ** Name: Custom Loading
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CLoading.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";
import {Spinner, Modal, Text, Layout} from "@ui-kitten/components";
import {StyleSheet, View} from "react-native";
/* COMMON */
import {colors, cStyles} from "~/utils/style";

function CLoading(props) {
  const {t} = useTranslation();
  const {
    show = false,
    description = "common:loading"
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <Modal
      visible={show}
      backdropStyle={styles.con_backdrop}
      onBackdropPress={() => null}>
      <View style={cStyles.flexCenter}>
        <Layout style={[cStyles.center, cStyles.rounded1, cStyles.p10]}>
          <Spinner />
        </Layout>
        {description && (
          <Text
            style={[cStyles.textCenter, cStyles.mt10]}
            status="control">
            {t(description)}
          </Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

CLoading.propTypes = {
  show: PropTypes.bool,
  description: PropTypes.string,
};

export default React.memo(CLoading);

/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Reset password screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useTheme, Layout, Text} from "@ui-kitten/components";
import {ScrollView, View} from "react-native";
import IoniIcon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
/* COMPONENTS */
import CContainer from "~/components/CContainer";
import CTopNavigation from "~/components/CTopNavigation";
import CForm from "~/components/CForm";
/* COMMON */
import Routes from "~/navigator/Routes";
import {cStyles} from "~/utils/style";
import {moderateScale, resetRoute} from "~/utils/helper";
/* REDUX */
import * as Actions from "~/redux/actions";

const MyContent = Animatable.createAnimatableComponent(Layout);
const MyIconAnim = Animatable.createAnimatableComponent(IoniIcon);
const sIconStatus = moderateScale(120);

/** All init */
const INPUT_NAME = {
  PASSWORD: "password",
};

function ResetPassword(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation, route} = props;
  const tokenData = route.params?.tokenData || "not_token";
  const bgHeader = theme["background-basic-color-2"];
  const colorSuccess = theme["color-success-500"];
  const colorError = theme["color-danger-500"];

  /** use ref */
  const formRef = useRef();
  const contentRef = useRef();

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const language = commonState["language"];

  /** Use state */
  const [loading, setLoading] = useState({
    check: false,
    update: false,
  });
  const [values, setValues] = useState({
    password: "",
    success: false,
    error: false,
    errorExpired: false,
  });
  const [showAlert, setShowAlert] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBack = () => resetRoute(navigation, Routes.LOGIN_IN.name);

  /**********
   ** FUNC **
   **********/
  const onSubmitSave = () => {
    setLoading({...loading, update: true});
    /** Set value for password */
    let tmpCallback = formRef.current?.onCallbackValue();
    setValues({password: tmpCallback.valuesAll[0].value});
    /** Submit */
    let params = {
      Lang: language,
      TokenData: tokenData,
      NewPassword: values.password,
    };
    dispatch(Actions.fetchUpdatePassword(params));
  };

  const onCheckTokenExpired = () => {
    let params = {
      Token: tokenData,
      Lang: language,
    };
    dispatch(Actions.fetchCheckTokenPassword(params));
    setLoading({...loading, check: true});
  };

  const onCompleteCheck = (status, message) => {
    setValues({
      ...values,
      error: false,
      errorExpired: !status
        ? message || "forgot_password:error_holder_cannot_change_password_1"
        : false,
    });
    setLoading({check: false, update: false});
    !status && setShowAlert(true);
  };

  const onCompleteChange = (status, message) => {
    setValues({
      ...values,
      success: status,
      error: message || "forgot_password:error_change_password",
      errorExpired: false,
    });
    setLoading({check: false, update: false});
    setShowAlert(true);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(async () => {
    dispatch(Actions.resetCheckTokenPassword());
    onCheckTokenExpired();
  }, []);

  useEffect(() => {
    if (loading.check) {
      if (!authState["submittingCheckTokenPass"]) {
        if (authState["successCheckTokenPass"]) {
          return contentRef.current.fadeOutDown(1000).then(endState => {
            if (endState.finished) {
              onCompleteCheck(true);
            }
          });
        }

        if (authState["errorCheckTokenPass"]) {
          return onCompleteCheck(false);
        }
      }
    }
  }, [
    loading.check,
    authState["submittingCheckTokenPass"],
    authState["successCheckTokenPass"],
    authState["errorCheckTokenPass"],
  ]);

  useEffect(() => {
    if (loading.update) {
      if (!authState["submittingUpdatePass"]) {
        if (authState["successUpdatePass"]) {
          return onCompleteChange(true);
        }

        if (authState["errorUpdatePass"]) {
          return onCompleteChange(
            false,
            typeof authState["errorHelperUpdatePass"] === "string"
              ? authState["errorHelperUpdatePass"]
              : null,
          );
        }
      }
    }
  }, [
    loading.update,
    authState["submittingUpdatePass"],
    authState["successUpdatePass"],
    authState["errorUpdatePass"],
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={["top"]}
      backgroundColor={bgHeader}>
      {/** Header */}
      <CTopNavigation
        style={{backgroundColor: bgHeader}}
        leftTitle={"reset_password:title"}
        back
        onPressCustomBack={handleGoBack}
      />
      <ScrollView
        contentContainerStyle={cStyles.flex1}
        keyboardShouldPersistTaps="handled">
        {/** Content prepare send */}
        {!showAlert && (
          <MyContent
            ref={contentRef}
            style={[
              cStyles.flex1,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.shadowListItem,
              cStyles.mt32,
              cStyles.py16,
              cStyles.px32,
            ]}
            animation="fadeInUp">
            {/** Caption */}
            <View style={cStyles.mt16}>
              <Text style={cStyles.textCenter} category="p1">
                {t("reset_password:caption")}
              </Text>
            </View>

            {/** Form input */}
            <CForm
              ref={formRef}
              loading={loading.check || loading.update}
              inputs={[
                {
                  id: INPUT_NAME.PASSWORD,
                  type: "text",
                  label: "reset_password:input_label_password",
                  holder: "reset_password:input_holder_password",
                  value: values.password,
                  required: true,
                  password: true,
                  email: false,
                  phone: false,
                  number: false,
                  next: false,
                  return: "done",
                },
              ]}
              leftButton={loading.check || loading.update}
              labelButton={"common:save"}
              onSubmit={onSubmitSave}
            />
          </MyContent>
        )}

        {/** Content when success */}
        {showAlert && values.success && (
          <MyContent
            style={[
              cStyles.flex1,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.shadowListItem,
              cStyles.mt32,
              cStyles.py16,
              cStyles.px32,
            ]}
            animation="fadeInUp">
            <View style={cStyles.itemsCenter}>
              <MyIconAnim
                name={"checkmark-circle-outline"}
                size={sIconStatus}
                color={colorSuccess}
                animation="pulse"
                easing="ease-out"
              />
            </View>

            {/** Sub-title & Caption */}
            <View style={cStyles.mt16}>
              <Text style={cStyles.textCenter} category="s1">
                {t("reset_password:success_sub_title")}
              </Text>
              <Text style={[cStyles.mt16, cStyles.textCenter]}>
                {t("reset_password:success_caption")}
              </Text>
            </View>
          </MyContent>
        )}

        {showAlert && !values.success && (
          <MyContent
            style={[
              cStyles.flex1,
              cStyles.roundedTopLeft5,
              cStyles.roundedTopRight5,
              cStyles.shadowListItem,
              cStyles.mt32,
              cStyles.py16,
              cStyles.px32,
            ]}
            animation="fadeInUp">
            <View style={cStyles.itemsCenter}>
              <MyIconAnim
                name={"close-circle-outline"}
                size={sIconStatus}
                color={colorError}
                animation="pulse"
                easing="ease-out"
              />
            </View>

            {/** Sub-title & Caption */}
            <View style={cStyles.mt16}>
              <Text style={cStyles.textCenter} category="s1">
                {t("reset_password:error_sub_title")}
              </Text>
              <Text style={[cStyles.mt16, cStyles.textCenter]}>
                {values.errorExpired !== ""
                  ? t(values.errorExpired)
                  : t(values.error)}
              </Text>
            </View>
          </MyContent>
        )}
      </ScrollView>
    </CContainer>
  );
}

export default ResetPassword;

/**
 ** Name: Contact Information
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactInformation.js
 **/
import React, {createRef, useState} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
/* COMPONENTS */
import CInput from '~/components/CInput';
import CGroupInfo from '~/components/CGroupInfo';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, moderateScale} from '~/utils/helper';

const INPUT_NAME = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  TITLE: 'title',
  SCHOOL_NAME: 'schoolName',
  DEPT: 'dept',
  ADDRESS: 'address',
  ROAD: 'road',
  DISTRICT: 'district',
  PROVINCE: 'province',
  ZIP_CODE: 'zipCode',
  PHONE_OFFICE: 'phoneOffice',
  PHONE_FAX: 'phoneFax',
  PHONE_MOBILE: 'phoneMobile',
  EMAIL: 'email',
  TORF: 'torF',
  TYPE: 'type',
  SUPPLIER: 'supplier',
};

const inputRef = {
  firstNameRef: createRef(),
  lastNameRef: createRef(),
  titleInfoRef: createRef(),
  schoolNameRef: createRef(),
  deptRef: createRef(),
  addressRef: createRef(),
  roadRef: createRef(),
  districtRef: createRef(),
  provinceRef: createRef(),
  zipCodeRef: createRef(),
  phoneOfficeRef: createRef(),
  phoneFaxRef: createRef(),
  phoneMobileRef: createRef(),
  emailRef: createRef(),
  torfRef: createRef(),
  typeRef: createRef(),
  supplierRef: createRef(),
};

function ContactInformation(props) {
  const {loading, index, data, disabled} = props;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    schoolName: '',
    dept: '',
    address: '',
    road: '',
    district: '',
    province: '',
    zipCode: '',
    phoneOffice: '',
    phoneFax: '',
    phoneMobile: '',
    email: '',
    torF: '',
    type: '',
    visited: true,
    supplier: '',
  });
  const [error, setError] = useState({
    firstName: false,
    firstNameHelper: '',
    lastName: false,
    lastNameHelper: '',
    title: false,
    titleHelper: '',
    schoolName: false,
    schoolNameHelper: '',
    dept: false,
    deptHelper: '',
    address: false,
    addressHelper: '',
    road: false,
    roadHelper: '',
    district: false,
    districtHelper: '',
    province: false,
    provinceHelper: '',
    zipCode: false,
    zipCodeHelper: '',
    phoneOffice: false,
    phoneOfficeHelper: '',
    phoneFax: false,
    phoneFaxHelper: '',
    phoneMobile: false,
    phoneMobileHelper: '',
    email: false,
    emailHelper: '',
    torF: false,
    torFHelper: '',
    type: false,
    typeHelper: '',
    supplier: false,
    supplierHelper: '',
  });

  const handleChangeText = (value, inputName) => {
    setForm({...form, [inputName]: value});
  };

  const handleChangeInput = ref => {
    if (ref) {
      ref.current.focus();
    }
  };

  return (
    <CGroupInfo
      style={cStyles.flex1}
      containerLabelStyle={cStyles.center}
      contentStyle={[cStyles.p0, cStyles.mb0]}
      label={'sales_visit:title_contact_information'}
      content={
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            style={cStyles.flex1}
            contentContainerStyle={cStyles.p16}>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.mr5, styles.con_left]}>
                <CInput
                  inputRef={inputRef.firstNameRef}
                  name={INPUT_NAME.FIRST_NAME}
                  label={'sales_visit:first_name'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:first_name'}
                  value={form.firstName}
                  returnKey={'next'}
                  error={error.firstName}
                  errorHelperCustom={error.firstNameHelper}
                  onChangeInput={() => handleChangeInput(inputRef.lastNameRef)}
                  onChangeValue={handleChangeText}
                />
              </View>
              <View style={[cStyles.ml5, styles.con_right]}>
                <CInput
                  inputRef={inputRef.lastNameRef}
                  name={INPUT_NAME.LAST_NAME}
                  label={'sales_visit:last_name'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:last_name'}
                  value={form.lastName}
                  returnKey={'next'}
                  error={error.lastName}
                  errorHelperCustom={error.lastNameHelper}
                  onChangeInput={() => handleChangeInput(inputRef.titleInfoRef)}
                  onChangeValue={handleChangeText}
                />
              </View>
            </View>

            <View style={styles.separator} />

            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.mr5, styles.con_middle]}>
                <CInput
                  inputRef={inputRef.deptRef}
                  name={INPUT_NAME.DEPT}
                  label={'sales_visit:dept'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:dept'}
                  value={form.dept}
                  returnKey={'next'}
                  error={error.dept}
                  errorHelperCustom={error.deptHelper}
                  onChangeInput={() => handleChangeInput(inputRef.addressRef)}
                  onChangeValue={handleChangeText}
                />
              </View>

              <View style={[cStyles.mr5, styles.con_middle]}>
                <CInput
                  inputRef={inputRef.titleInfoRef}
                  name={INPUT_NAME.TITLE}
                  label={'sales_visit:title_info'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:title_info'}
                  value={form.title}
                  returnKey={'next'}
                  error={error.title}
                  errorHelperCustom={error.titleHelper}
                  onChangeInput={() =>
                    handleChangeInput(inputRef.schoolNameRef)
                  }
                  onChangeValue={handleChangeText}
                />
              </View>
            </View>

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.schoolNameRef}
              name={INPUT_NAME.SCHOOL_NAME}
              label={'sales_visit:school_name'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:school_name'}
              value={form.schoolName}
              returnKey={'next'}
              error={error.schoolName}
              errorHelperCustom={error.schoolNameHelper}
              onChangeInput={() => handleChangeInput(inputRef.deptRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.addressRef}
              name={INPUT_NAME.ADDRESS}
              label={'sales_visit:address'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:address'}
              value={form.address}
              returnKey={'next'}
              error={error.address}
              errorHelperCustom={error.addressHelper}
              onChangeInput={() => handleChangeInput(inputRef.roadRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.roadRef}
              name={INPUT_NAME.ROAD}
              label={'sales_visit:road'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:road'}
              value={form.road}
              returnKey={'next'}
              error={error.road}
              errorHelperCustom={error.roadHelper}
              onChangeInput={() => handleChangeInput(inputRef.districtRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.districtRef}
              name={INPUT_NAME.DISTRICT}
              label={'sales_visit:district'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:district'}
              value={form.district}
              returnKey={'next'}
              error={error.district}
              errorHelperCustom={error.districtHelper}
              onChangeInput={() => handleChangeInput(inputRef.provinceRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.mr5, styles.con_left_1]}>
                <CInput
                  inputRef={inputRef.provinceRef}
                  name={INPUT_NAME.PROVINCE}
                  label={'sales_visit:province'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:province'}
                  value={form.province}
                  returnKey={'next'}
                  error={error.province}
                  errorHelperCustom={error.provinceHelper}
                  onChangeInput={() => handleChangeInput(inputRef.zipCodeRef)}
                  onChangeValue={handleChangeText}
                />
              </View>

              <View style={[cStyles.ml5, styles.con_right_1]}>
                <CInput
                  inputRef={inputRef.zipCodeRef}
                  name={INPUT_NAME.ZIP_CODE}
                  label={'sales_visit:zip_code'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:zip_code'}
                  value={form.zipCode}
                  keyboard={'phone-pad'}
                  returnKey={'next'}
                  error={error.zipCode}
                  errorHelperCustom={error.zipCodeHelper}
                  onChangeInput={() =>
                    handleChangeInput(inputRef.phoneOfficeRef)
                  }
                  onChangeValue={handleChangeText}
                />
              </View>
            </View>

            <View style={styles.separator} />

            <CInput
              row
              inputRef={inputRef.phoneOfficeRef}
              name={INPUT_NAME.PHONE_OFFICE}
              label={'sales_visit:phone_office'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:phone_office'}
              value={form.phoneOffice}
              keyboard={'phone-pad'}
              returnKey={'next'}
              error={error.phoneOffice}
              errorHelperCustom={error.phoneOfficeHelper}
              onChangeInput={() => handleChangeInput(inputRef.phoneFaxRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              row
              inputRef={inputRef.phoneFaxRef}
              name={INPUT_NAME.PHONE_FAX}
              label={'sales_visit:phone_fax'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:phone_fax'}
              value={form.phoneFax}
              keyboard={'phone-pad'}
              returnKey={'next'}
              error={error.phoneFax}
              errorHelperCustom={error.phoneFaxHelper}
              onChangeInput={() => handleChangeInput(inputRef.phoneMobileRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              row
              inputRef={inputRef.phoneMobileRef}
              name={INPUT_NAME.PHONE_MOBILE}
              label={'sales_visit:phone_mobile'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:phone_mobile'}
              value={form.phoneMobile}
              keyboard={'phone-pad'}
              returnKey={'next'}
              error={error.phoneMobile}
              errorHelperCustom={error.phoneMobileHelper}
              onChangeInput={() => handleChangeInput(inputRef.emailRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.emailRef}
              name={INPUT_NAME.EMAIL}
              label={'sales_visit:email'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:email'}
              value={form.email}
              keyboard={'email-address'}
              returnKey={'next'}
              error={error.email}
              errorHelperCustom={error.emailHelper}
              onChangeInput={() => handleChangeInput(inputRef.torfRef)}
              onChangeValue={handleChangeText}
            />

            <View style={styles.separator} />

            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.mr5, styles.con_middle]}>
                <CInput
                  inputRef={inputRef.torfRef}
                  name={INPUT_NAME.TORF}
                  label={'sales_visit:torf'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:torf'}
                  value={form.torF}
                  returnKey={'next'}
                  error={error.torF}
                  errorHelperCustom={error.torFHelper}
                  onChangeInput={() => handleChangeInput(inputRef.typeRef)}
                  onChangeValue={handleChangeText}
                />
              </View>

              <View style={[cStyles.ml5, styles.con_middle]}>
                <CInput
                  inputRef={inputRef.typeRef}
                  name={INPUT_NAME.TYPE}
                  label={'sales_visit:type'}
                  styleFocus={styles.input_focus}
                  disabled={loading}
                  holder={'sales_visit:type'}
                  value={form.type}
                  returnKey={'next'}
                  error={error.type}
                  errorHelperCustom={error.typeHelper}
                  onChangeInput={() => handleChangeInput(inputRef.supplierRef)}
                  onChangeValue={handleChangeText}
                />
              </View>
            </View>

            <View style={styles.separator} />

            <CInput
              inputRef={inputRef.supplierRef}
              name={INPUT_NAME.SUPPLIER}
              label={'sales_visit:supplier'}
              styleFocus={styles.input_focus}
              disabled={loading}
              holder={'sales_visit:supplier'}
              value={form.supplier}
              returnKey={'next'}
              error={error.supplier}
              errorHelperCustom={error.supplierHelper}
              // onChangeInput={() => handleChangeInput(inputRef.supplierRef)}
              onChangeValue={handleChangeText}
            />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  con_left: {flex: 0.4},
  con_right: {flex: 0.6},
  con_left_1: {flex: 0.6},
  con_right_1: {flex: 0.4},
  con_middle: {flex: 0.5},
  content: {backgroundColor: colors.TRANSPARENT},
  separator: {height: moderateScale(16)},
});

export default ContactInformation;

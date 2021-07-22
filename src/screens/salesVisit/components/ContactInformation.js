/**
 ** Name: Contact Information
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ContactInformation.js
 **/
import React, {createRef, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
/* COMPONENTS */
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
import CGroupInfo from '~/components/CGroupInfo';
/** COMMON */
import {colors, cStyles} from '~/utils/style';

/* REDUX */

const INPUT_NAME = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
};

let firstNameRef = createRef();
let lastNameRef = createRef();

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
  });

  const handleChangeText = (value, inputName) => {
    setForm({...form, [inputName]: value});
  };

  const handleChangeInput = inputRef => {
    if (inputRef) {
      inputRef.current.focus();
    }
  };

  return (
    <CGroupInfo
      containerLabelStyle={cStyles.center}
      label={'sales_visit:title_contact_information'}
      content={
        <ScrollView>
          <View>
            <CLabel bold label={'sales_visit:first_name'} />
            <CInput
              name={INPUT_NAME.FIRST_NAME}
              styleFocus={styles.input_focus}
              inputRef={firstNameRef}
              disabled={loading}
              holder={'sales_visit:first_name'}
              value={form.firstName}
              keyboard={'default'}
              returnKey={'next'}
              password
              error={error.firstName}
              errorHelperCustom={error.firstNameHelper}
              onChangeInput={() => handleChangeInput(lastNameRef)}
              onChangeValue={handleChangeText}
            />
          </View>

          <View style={cStyles.pt16}>
            <CLabel bold label={'sales_visit:last_name'} />
            <CInput
              name={INPUT_NAME.LAST_NAME}
              styleFocus={styles.input_focus}
              inputRef={lastNameRef}
              disabled={loading}
              holder={'sales_visit:last_name'}
              value={form.lastName}
              keyboard={'default'}
              returnKey={'next'}
              password
              error={error.lastName}
              errorHelperCustom={error.lastNameHelper}
              // onChangeInput={() => handleChangeInput(confirmPasswordRef)}
              onChangeValue={handleChangeText}
            />
          </View>
        </ScrollView>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
});

export default ContactInformation;

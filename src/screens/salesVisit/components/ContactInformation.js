/**
 ** Name: Contact Information
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ContactInformation.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CLabel from '~/components/CLabel';
import CInput from '~/components/CInput';
/* COMMON */

/* REDUX */

const INPUT_NAME = {
  NAME: 'name',

};


function ContactInformation(props) {
  const {index, data, disabled, } = props;

  const [] = useState({
    name: '',
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

  const handleChangeText = (value, inputName) => {

  };

  return (
    <CCard
      label={data.label}
      content={
        <View>
          <View>
            <CLabel medium label={'Salutation/Name'} />
            {/* <CInput
              name={INPUT_NAME.NAME}
              styleFocus={styles.input_focus}
              disabled={disabled}
              holder={'Name'}
              value={form.reason}
              keyboard={'default'}
              returnKey={'next'}
              onChangeInput={() => handleChangeInput(supplierRef)}
              onChangeValue={handleChangeText}
            /> */}
          </View>
        </View>
      }
    />
  );
}

// const styles = StyleSheet.create({
//   input_focus: {
//     borderColor: colors.SECONDARY,
//   },
// });

export default ContactInformation;

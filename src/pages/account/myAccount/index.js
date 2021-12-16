/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: MyAccount
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of MyAccount.js
 **/
import React, {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme, Card, Button} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CForm from '~/components/CForm';
import CText from '~/components/CText';
/* COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All init */
const INPUT_NAME = {
  EMPLOYEE_CODE: 'employeeCode',
  USER_NAME: 'userName',
  FULL_NAME: 'fullName',
  DEPARTMENT: 'department',
  REGION: 'region',
};

function MyAccount(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** Use ref */
  const formRef = useRef(); 

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [department, setDepartment] = useState(null);
  const [region, setRegion] = useState(null);

  /** Use redux */
  const dispatch = useDispatch();
  const authState = useSelector(({auth}) => auth);
  const commonState = useSelector(({common}) => common);
  const masterState = useSelector(({masterData}) => masterData);
  const language = commonState.get('language');
  const refreshToken = authState.getIn(['login', 'refreshToken']);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeAvatar = () => {
    
  };

  /**********
   ** FUNC **
   **********/
  const onFetchData = () => {
    let params = {
      listType: 'Department, Region',
      RefreshToken: refreshToken,
      Lang: language,
    };
    dispatch(Actions.fetchMasterData(params, navigation));
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onFetchData(), []);

  useEffect(() => {
    if (loading) {
      if (!department || !region) {
        if (masterState.get('department').length > 0 && !department) {
          let departments = masterState.get('department');
          let myDeptCode = authState.getIn(['login', 'deptCode']);
          let findDept = departments.find(f => f.deptCode === myDeptCode);
          if (findDept) {
            setDepartment(findDept);
          }
        }
        if (masterState.get('region').length > 0 && !region) {
          let regions = masterState.get('region');
          let myRegionCode = authState.getIn(['login', 'regionCode']);
          let findRegion = regions.find(f => f.regionCode === myRegionCode);
          if (findRegion) {
            setRegion(findRegion);
          }
        }
      }
      if (department && region) setLoading(false);
    }
  }, [loading, department, region, masterState, authState]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={
        <CTopNavigation
          title="my_account:title"
          back
          borderBottom
        />
      }>
      <KeyboardAwareScrollView contentContainerStyle={cStyles.p16}>
        <View
          style={[
            cStyles.itemsCenter,
            cStyles.pb10,
          ]}>
          <View style={[styles.con_avatar, cStyles.center]}>
            <FastImage
              style={[styles.img_avatar, cStyles.rounded10]}
              resizeMode={'cover'}
              source={Assets.iconUser} />
          </View>
          <Button style={cStyles.mt5} size="tiny" appearance="ghost" onPress={handleChangeAvatar}>
            {propsB =>
              <CText style={cStyles.textUnderline} status="primary">
                {t('my_account:edit_avatar')}
              </CText>}
          </Button>
        </View>

        <Card
          disabled
          header={
            <CText category="label">{t('my_account:info_basic')}</CText>
          }>
          <CForm
            ref={formRef}
            loading={loading}
            inputs={[
              {
                id: INPUT_NAME.EMPLOYEE_CODE,
                style: cStyles.mt10,
                type: 'text',
                label: 'my_account:employee_code',
                holder: 'my_account:employee_code',
                value: authState.getIn(['login', 'empCode']),
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.USER_NAME,
                type: 'text',
                label: 'my_account:user_name',
                holder: 'my_account:user_name',
                value: authState.getIn(['login', 'userName']),
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.FULL_NAME,
                type: 'text',
                label: 'my_account:full_name',
                holder: 'my_account:full_name',
                value: authState.getIn(['login', 'fullName']),
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.DEPARTMENT,
                type: 'text',
                label: 'my_account:department',
                holder: 'my_account:department',
                value: department ? department.deptName : '',
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: true,
                return: 'next',
              },
              {
                id: INPUT_NAME.REGION,
                type: 'text',
                label: 'my_account:region',
                holder: 'my_account:region',
                value: region ? region.regionName : '',
                required: true,
                password: false,
                email: false,
                phone: false,
                number: false,
                next: false,
                return: 'done',
              },
            ]}
          />
        </Card>
      </KeyboardAwareScrollView>
    </CContainer>
  );
}

const styles = StyleSheet.create({
  con_avatar: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(90),
    backgroundColor: 'rgba(255,255,255,.5)',
  },
  img_avatar: {
    height: moderateScale(80),
    width: moderateScale(80)
  },
  con_camera: {
    height: moderateScale(20),
    width: moderateScale(20),
    right: -moderateScale(2),
    bottom: -moderateScale(2)
  },
  icon_camera: {
    height: moderateScale(13),
    width: moderateScale(13),
  },
});

export default MyAccount;

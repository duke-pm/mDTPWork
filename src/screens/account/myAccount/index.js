/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: MyAccount
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of MyAccount.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
/* COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';
import CInput from '~/components/CInput';

const RowInfo = ({style = {}, label = '', value = ''}) => {
  return (
    <View style={[cStyles.flex1, cStyles.mt16, style]}>
      <CInput label={label} holder={label} value={value} disabled />
    </View>
  );
};

function MyAccount(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {navigation} = props;

  /** Use state */
  const [loading, setLoading] = useState(true);
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

      if (department && region) {
        setLoading(false);
      }
    }
  }, [loading, department, region, masterState, authState]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      hasShapes
      content={
        <CContent padder>
          <View
            style={[
              cStyles.itemsCenter,
              IS_ANDROID && styles.con_avatar_android,
            ]}>
            <CAvatar
              isEdit={true}
              size={'vlarge'}
              label={authState.getIn(['login', 'fullName'])}
            />
          </View>

          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
              cStyles.mt20,
            ]}>
            <RowInfo
              style={[styles.row, cStyles.mr5]}
              label={'my_account:employee_code'}
              value={authState.getIn(['login', 'empCode'])}
            />

            <RowInfo
              style={[styles.row, cStyles.ml5]}
              label={'my_account:user_name'}
              value={authState.getIn(['login', 'userName'])}
            />
          </View>

          <RowInfo
            label={'my_account:full_name'}
            value={authState.getIn(['login', 'fullName'])}
          />

          {department && (
            <RowInfo
              label={'my_account:department'}
              value={department.deptName}
            />
          )}

          {region && (
            <RowInfo label={'my_account:region'} value={region.regionName} />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_avatar_android: {paddingTop: moderateScale(80)},
  row: {flex: 0.5},
});

export default MyAccount;

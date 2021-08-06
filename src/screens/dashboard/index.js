/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Dashboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import CItem from '~/components/CItem';
/** COMMON */
import Configs from '~/config';
import Routes from '~/navigation/Routes';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';

function Dashboard(props) {
  const {customColors} = useTheme();
  const {navigation} = props;

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  if (Configs.salesVisit) {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleNewFeature}>
          <View>
            <Icon
              name={'logo-react'}
              color={IS_ANDROID ? colors.WHITE : customColors.icon}
              size={moderateScale(23)}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = dataRoute => {
    navigation.navigate(dataRoute.mName, {
      idRouteParent: dataRoute.menuID,
    });
  };

  const handleNewFeature = () => {
    navigation.navigate(Routes.MAIN.SALES_VISIT.name);
  };

  /**********
   ** FUNC **
   **********/
  const onStart = () => setLoading(false);

  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(['login', 'lstMenu']);
    if (tmpListMenu && tmpListMenu.lstPermissionItem.length > 0) {
      /** Check permission user can access */
      let item = null,
        tmpRoutes = [];
      for (item of tmpListMenu.lstPermissionItem) {
        if (item.isAccess) {
          tmpRoutes.push(item);
        }
      }
      setRoutes(tmpRoutes);
    }
    onStart();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      content={
        <CContent scrollEnabled={false}>
          {!loading && (
            <CList
              contentStyle={cStyles.pt16}
              numColumns={3}
              data={routes}
              item={({item, index}) => {
                if (item.isAccess) {
                  return (
                    <CItem index={index} data={item} onPress={handleItem} />
                  );
                }
                return null;
              }}
            />
          )}
        </CContent>
      }
    />
  );
}

export default Dashboard;

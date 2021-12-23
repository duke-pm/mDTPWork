/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Project Management
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectManagement.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CContentSubMenu from '~/components/CContentSubMenu';
/** COMMON */
import Configs from '~/configs';
import {Animations} from '~/utils/asset';

function ProjectManagement(props) {
  const {navigation, route} = props;

  /** Use redux */
  const authState = useSelector(({auth}) => auth);

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = dataRoute => {
    navigation.navigate(dataRoute.mName, {
      permission: {write: dataRoute.isWrite},
    });
  };

  /**********
   ** FUNC **
   **********/

  const onPrepareData = () => {
    let tmpListMenu = authState.getIn(['login', 'lstMenu']);
    let idRouteParent = route.params.idRouteParent;
    if (idRouteParent && tmpListMenu) {
      let findChildren = tmpListMenu.lstPermissionItem.find(
        f => f.menuID === idRouteParent,
      );
      if (findChildren) {
        /** Check permission user can access */
        let item = null,
          tmpRoutes = [];
        for (item of findChildren.lstPermissionItem) {
          if (item.isAccess) {
            tmpRoutes.push(item);
          }
        }
        setRoutes(tmpRoutes);
      }
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

  useEffect(() => setLoading(false), [routes]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={
        <CTopNavigation
          title="project_management:main_title"
          back
        />
      }>
      <CContentSubMenu
        loading={loading}
        routes={routes}
        title={'project_management:project_services'}
        holder={'project_management:project_services_holder'}
        animTypeImage={Animations.projectHolder}
        colorsItem={Configs.colorsSubMenu.project}
        onPressItem={handleItem}
      />
    </CContainer>
  );
}

export default ProjectManagement;

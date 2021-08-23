/**
 ** Name: List Project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Projects.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {View, LayoutAnimation, UIManager} from 'react-native';
/* COMPONENTS */
import CList from '~/components/CList';
import CAlert from '~/components/CAlert';
import ProjectItem from '../components/ProjectItem';
import ProjectPlan from '../components/ProjectPlan';
import ProjectDetails from '../components/ProjectDetails';
/** COMMON */
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ListProject(props) {
  const navigation = useNavigation();
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    formatDateView = 'DD/MM/YYYY',
    onLoadmore = undefined,
    onRefresh = undefined,
  } = props;

  /** Use state */
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalProjectPlan, setShowModalProjectPlan] = useState(false);
  const [loadingModal, setLoadingModal] = useState(true);
  const [chooseProject, setChooseProject] = useState(null);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleItem = data => {
    navigation.navigate(Routes.MAIN.PROJECT_DETAIL.name, {
      data: {
        projectID: data.prjID,
        projectName: data.prjName,
        projectStatus: data.statusName,
      },
    });
  };

  const handleHeaderItem = project => {
    setShowModalDetail(true);
    setChooseProject(project);
  };

  const handleProjectPlan = project => {
    setShowModalProjectPlan(true);
    setChooseProject(project);
  };

  const handleCloseModalDetail = () => {
    setShowModalDetail(false);
  };

  const handleCloseModalPlan = () => {
    setShowModalProjectPlan(false);
  };

  /**********
   ** FUNC **
   **********/
  const onModalHide = () => {
    setLoadingModal(true);
    setChooseProject(null);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loadingModal && (showModalDetail || showModalProjectPlan)) {
      if (chooseProject) {
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLoadingModal(false);
        }, 300);
      }
    }
  }, [loadingModal, showModalDetail, showModalProjectPlan, chooseProject]);

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.flex1}>
      {/** List of project */}
      <CList
        style={cStyles.pt10}
        contentStyle={cStyles.p10}
        data={props.data}
        item={({item, index}) => {
          return (
            <ProjectItem
              index={index}
              data={item}
              formatDateView={formatDateView}
              customColors={customColors}
              isDark={isDark}
              onPress={handleItem}
              onPressDetail={handleHeaderItem}
              onPressPlan={handleProjectPlan}
            />
          );
        }}
        refreshing={props.refreshing}
        onRefresh={onRefresh}
        loadingmore={props.loadmore}
        onLoadmore={onLoadmore}
      />

      {/** Alert show info of project */}
      <CAlert
        show={showModalDetail}
        loading={loadingModal}
        title={chooseProject ? chooseProject.prjName : ''}
        customContent={
          loadingModal ? null : (
            <ProjectDetails
              isDark={isDark}
              customColors={customColors}
              formatDateView={formatDateView}
              project={chooseProject}
            />
          )
        }
        onClose={handleCloseModalDetail}
        onModalHide={onModalHide}
      />

      {/** Alert show project plan */}
      <CAlert
        show={showModalProjectPlan}
        loading={loadingModal}
        title={chooseProject ? chooseProject.prjName : ''}
        customContent={
          <ProjectPlan
            isDark={isDark}
            customColors={customColors}
            project={chooseProject}
          />
        }
        onClose={handleCloseModalPlan}
        onModalHide={onModalHide}
      />
    </View>
  );
}

ListProject.propTypes = {
  refreshing: PropTypes.bool,
  loadmore: PropTypes.bool,
  data: PropTypes.array,
  formatDateView: PropTypes.string,
  onLoadmore: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default ListProject;

/**
 ** Name: List Project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Projects.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useTheme, List, Spinner} from '@ui-kitten/components';
import {View, LayoutAnimation, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CEmpty from '~/components/CEmpty';
import CAlert from '~/components/CAlert';
import ProjectItem from '../components/ProjectItem';
import ProjectDetails from '../components/ProjectDetails';
import ProjectPlan from '../components/ProjectPlan';
/** COMMON */
import Routes from '~/navigator/Routes';
import {IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RenderLoading = () => (
  <View style={cStyles.flexCenter}>
    <Spinner style={cStyles.py16} />
  </View>
);

function ListProject(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme();
  const {
    year = moment().year(),
    onLoadmore = undefined,
    onRefresh = undefined,
  } = props;

  /** Use state */
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalOverview, setShowModalOverview] = useState(false);
  const [loadingModal, setLoadingModal] = useState(true);
  const [chooseProject, setChooseProject] = useState(null);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleCloseModalDetail = () => {
    setShowModalDetail(false);
    setChooseProject(null);
  };

  const handleCloseModalOverview = () => {
    setShowModalOverview(false);
    setChooseProject(null);
  };

  const handleDetails = project => {
    setShowModalDetail(true);
    setChooseProject(project);
  };

  const handleOverview = project => {
    setShowModalOverview(true);
    setChooseProject(project);
  };

  const handleItem = data => {
    if (data.countChild > 0) {
      navigation.push(Routes.PROJECTS.name, {
        year,
        projectID: data.prjID,
      });
    } else if (data.countTask > 0) {
      navigation.navigate(Routes.TASKS.name, {
        data: {
          projectID: data.prjID,
          projectName: data.prjName,
          projectStatus: data.statusName,
        },
      });
    } else return;
  };

  /**********
   ** FUNC **
   **********/

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (loadingModal && (showModalDetail || showModalOverview)) {
      if (chooseProject) {
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLoadingModal(false);
        }, 500);
      }
    }
  }, [loadingModal, showModalDetail, showModalOverview, chooseProject]);

  /************
   ** RENDER **
   ************/
  const RenderProjectItem = info => {
    return (
      <ProjectItem
        trans={t}
        theme={theme}
        index={info.index}
        data={info.item}
        onPress={handleItem}
        onPressDetail={handleDetails}
        onPressOverview={handleOverview}
      />
    );
  };

  return (
    <View style={cStyles.flex1}>
      {/** List of project */}
      <List
        contentContainerStyle={cStyles.p10}
        data={props.data}
        renderItem={RenderProjectItem}
        keyExtractor={(item, index) => item.prjID + '_' + index}
        removeClippedSubviews={IS_ANDROID}
        refreshing={props.refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onLoadmore}
        ItemSeparatorComponent={() => <View style={cStyles.my5} />}
        ListEmptyComponent={<CEmpty />}
      />

      {/** Alert show info of project */}
      <CAlert
        show={showModalDetail}
        label={chooseProject ? chooseProject.prjName : ''}
        customMessage={
          loadingModal ? RenderLoading() : (
            <ProjectDetails
              trans={t}
              theme={theme}
              project={chooseProject}
            />
          )
        }
        cancel
        onCancel={handleCloseModalDetail}
      />

      {/** Alert show project plan */}
      <CAlert
        show={showModalOverview}
        label={chooseProject ? chooseProject.prjName : ''}
        customMessage={
          loadingModal ? RenderLoading() : (
            <ProjectPlan
              trans={t}
              theme={theme}
              project={chooseProject}
            />
          )
        }
        cancel
        onCancel={handleCloseModalOverview}
      />
    </View>
  );
}

ListProject.propTypes = {
  refreshing: PropTypes.bool,
  loadmore: PropTypes.bool,
  year: PropTypes.number,
  data: PropTypes.array,
  onLoadmore: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default ListProject;

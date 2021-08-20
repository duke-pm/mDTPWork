/**
 ** Name: List Project
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Projects.js
 **/
import React, {useState, useEffect} from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  LayoutAnimation,
  UIManager,
  ScrollView,
  processColor,
} from 'react-native';
import {HorizontalBarChart} from 'react-native-charts-wrapper';
import moment from 'moment';
/* COMPONENTS */
import CList from '~/components/CList';
import CAlert from '~/components/CAlert';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CText from '~/components/CText';
import CUser from '~/components/CUser';
import CStatusTag from '~/components/CStatusTag';
import CIcon from '~/components/CIcon';
import ProjectItem from '../components/ProjectItem';
import ProjectPlan from '../components/ProjectPlan';
/** COMMON */
import Icons from '~/config/Icons';
import Routes from '~/navigation/Routes';
import {DEFAULT_FORMAT_DATE_4, THEME_DARK} from '~/config/constants';
import {checkEmpty, IS_ANDROID, moderateScale} from '~/utils/helper';
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
  const {formatDateView, onLoadmore, onRefresh} = props;

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
  const usersInvitedLength =
    (chooseProject && chooseProject.lstUserInvited.length) || 0;
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
            <View>
              <View
                style={[
                  cStyles.borderTop,
                  isDark && cStyles.borderTopDark,
                  cStyles.fullWidth,
                  cStyles.pb16,
                ]}
              />

              {/** Info basic */}
              <View style={cStyles.itemsStart}>
                {/** Is public */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mb10]}>
                  <CLabel bold label={'project_management:is_public'} />
                  <CIcon
                    style={cStyles.ml3}
                    name={
                      chooseProject.isPublic ? Icons.checkCircle : Icons.alert
                    }
                    color={chooseProject.isPublic ? 'green' : 'orange'}
                    size={'smaller'}
                  />
                </View>

                {/** Date created */}
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel bold label={'project_management:date_created'} />
                  <CText
                    styles={'textCallout ml3'}
                    customLabel={moment(
                      chooseProject.crtdDate,
                      DEFAULT_FORMAT_DATE_4,
                    ).format(formatDateView)}
                  />
                </View>

                {/** Owner */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CLabel bold label={'project_management:owner'} />
                  <CUser style={cStyles.ml6} label={chooseProject.ownerName} />
                </View>

                {/** Status */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CLabel bold label={'project_management:status'} />
                  <CStatusTag
                    style={cStyles.ml6}
                    color={
                      isDark
                        ? chooseProject.colorDarkCode
                        : chooseProject.colorCode
                    }
                    customLabel={chooseProject.statusName}
                  />
                </View>
              </View>

              {/** Description */}
              <View style={cStyles.mt10}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel bold label={'project_management:description'} />
                  <CText
                    styles={'textCallout'}
                    customLabel={checkEmpty(chooseProject.descr)}
                  />
                </View>
              </View>

              {/** Users invited */}
              {usersInvitedLength > 0 && (
                <View style={cStyles.mt10}>
                  <CLabel bold label={'project_management:user_invited'} />
                  <ScrollView
                    style={[
                      cStyles.mt10,
                      cStyles.rounded2,
                      {backgroundColor: customColors.textInput},
                      styles.list_invited,
                    ]}>
                    {chooseProject.lstUserInvited.map((item, index) => {
                      return (
                        <View
                          key={item.userName}
                          style={[
                            cStyles.row,
                            cStyles.itemsCenter,
                            cStyles.ml3,
                          ]}>
                          <View style={cStyles.px10}>
                            <CAvatar label={item.fullName} size={'small'} />
                          </View>
                          <View
                            style={[
                              cStyles.ml5,
                              cStyles.py10,
                              cStyles.flex1,
                              index !== usersInvitedLength - 1 &&
                                cStyles.borderBottom,
                              index !== usersInvitedLength - 1 &&
                                isDark &&
                                cStyles.borderBottomDark,
                            ]}>
                            <CText
                              styles={'textCallout fontBold'}
                              customLabel={checkEmpty(item.fullName)}
                            />
                            <CText
                              styles={'textCaption1 mt3'}
                              customLabel={checkEmpty(item.email)}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
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
        customContent={<ProjectPlan project={chooseProject} />}
        onClose={handleCloseModalPlan}
        onModalHide={onModalHide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  list_invited: {maxHeight: moderateScale(180)},
});

export default ListProject;

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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CList from '~/components/CList';
import CAlert from '~/components/CAlert';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CText from '~/components/CText';
import ProjectItem from '../components/ProjectItem';
/** COMMON */
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
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {formatDateView, onLoadmore, onRefresh} = props;

  /** Use state */
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
    setChooseProject(project);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const onModalHide = () => {
    setLoadingModal(true);
    setChooseProject(null);
  };

  useEffect(() => {
    if (loadingModal && showModal) {
      if (chooseProject) {
        setTimeout(() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLoadingModal(false);
        }, 500);
      }
    }
  }, [loadingModal, showModal, chooseProject]);

  /**************
   ** RENDER **
   **************/
  const usersInvitedLength =
    (chooseProject && chooseProject.lstUserInvited.length) || 0;
  return (
    <>
      {/** List of project */}
      <CList
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
              onLongPress={handleHeaderItem}
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
        show={showModal}
        loading={loadingModal}
        title={chooseProject ? chooseProject.prjName : ''}
        customContent={
          loadingModal ? null : (
            <View>
              <View style={cStyles.itemsStart}>
                {/** Date created */}
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel label={'project_management:date_created'} />
                  <CText
                    styles={'textMeta ml3'}
                    customLabel={moment(
                      chooseProject.crtdDate,
                      DEFAULT_FORMAT_DATE_4,
                    ).format(formatDateView)}
                  />
                </View>

                {/** Is public */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CLabel label={'project_management:is_public'} />
                  <Icon
                    style={cStyles.ml3}
                    name={
                      chooseProject.isPublic
                        ? 'checkmark-circle'
                        : 'alert-circle'
                    }
                    color={
                      chooseProject.isPublic
                        ? customColors.green
                        : customColors.orange
                    }
                    size={moderateScale(14)}
                  />
                </View>

                {/** Owner */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CLabel label={'project_management:owner'} />
                  <CLabel
                    medium
                    customLabel={checkEmpty(chooseProject.ownerName)}
                  />
                </View>

                {/** Status */}
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt10]}>
                  <CLabel label={'project_management:status'} />
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.ml2]}>
                    <View
                      style={[
                        cStyles.mr3,
                        styles.status,
                        {
                          backgroundColor: isDark
                            ? chooseProject.colorDarkCode
                            : chooseProject.colorCode,
                        },
                      ]}
                    />
                    <CText
                      customStyles={[
                        cStyles.textMeta,
                        cStyles.fontBold,
                        cStyles.mr3,
                        {
                          color: isDark
                            ? chooseProject.colorDarkCode
                            : chooseProject.colorCode,
                        },
                      ]}
                      customLabel={chooseProject.statusName}
                    />
                  </View>
                </View>
              </View>

              {/** Description */}
              <View style={cStyles.mt10}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel label={'project_management:description'} />
                  <CLabel customLabel={checkEmpty(chooseProject.descr)} />
                </View>
              </View>

              {/** Users invited */}
              {usersInvitedLength > 0 && (
                <View style={cStyles.mt10}>
                  <CLabel label={'project_management:user_invited'} />
                  <ScrollView
                    style={[
                      cStyles.mt6,
                      cStyles.p10,
                      cStyles.rounded2,
                      styles.list_invited,
                      {backgroundColor: customColors.cardDisable},
                    ]}>
                    {chooseProject.lstUserInvited.map((item, index) => {
                      return (
                        <View
                          key={item.userName}
                          style={[
                            cStyles.row,
                            cStyles.itemsCenter,
                            cStyles.ml3,
                            index === usersInvitedLength - 1 && cStyles.pb20,
                          ]}>
                          <CAvatar
                            containerStyle={cStyles.mr5}
                            label={item.fullName}
                            size={'vsmall'}
                          />
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
                            <CLabel
                              medium
                              customLabel={checkEmpty(item.fullName)}
                            />
                            <CText
                              styles={'textMeta mt3'}
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
        onClose={handleCloseModal}
        onModalHide={onModalHide}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row_left: {flex: 0.55},
  row_right: {flex: 0.45},
  status: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  list_invited: {height: moderateScale(150)},
});

export default ListProject;

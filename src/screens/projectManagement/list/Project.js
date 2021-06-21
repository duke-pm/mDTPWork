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
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import moment from 'moment';
/* COMPONENTS */
import ProjectItem from '../components/ProjectItem';
import CList from '~/components/CList';
/** COMMON */
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';
import {checkEmpty, IS_ANDROID} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import CAlert from '~/components/CAlert';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
import CText from '~/components/CText';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

let isPrevIsParent = false;

function ListProject(props) {
  const navigation = useNavigation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {onLoadmore, onRefresh} = props;

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
  return (
    <>
      <CList
        data={props.data}
        item={({item, index}) => {
          isPrevIsParent = false;
          if (props.data[index - 1] && props.data[index - 1].countChild > 0) {
            isPrevIsParent = true;
          }
          return (
            <ProjectItem
              index={index}
              data={item}
              customColors={customColors}
              isDark={isDark}
              isPrevIsParent={isPrevIsParent}
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

      <CAlert
        show={showModal}
        loading={loadingModal}
        title={chooseProject ? chooseProject.prjName : ''}
        customContent={
          loadingModal ? (
            <ActivityIndicator />
          ) : (
            <View>
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyBetween,
                ]}>
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
                  <CLabel label={'project_management:date_created'} />
                  <CText
                    styles={'textMeta ml3'}
                    customLabel={moment(
                      chooseProject.crtdDate,
                      'YYYY-MM-DDTHH:mm:ss',
                    ).format('DD/MM/YYYY')}
                  />
                </View>

                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <CLabel label={'project_management:is_public'} />
                  <Icon
                    style={cStyles.ml3}
                    name={
                      chooseProject.isPublic ? 'check-circle' : 'alert-circle'
                    }
                    color={
                      chooseProject.isPublic
                        ? customColors.green
                        : customColors.orange
                    }
                    size={15}
                  />
                </View>
              </View>

              <View
                style={[
                  cStyles.row,
                  cStyles.itemsStart,
                  cStyles.justifyBetween,
                  cStyles.mt10,
                ]}>
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
                  <CLabel label={'project_management:owner'} />
                  <CLabel
                    medium
                    customLabel={checkEmpty(chooseProject.ownerName)}
                  />
                </View>

                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <CLabel label={'project_management:status'} />
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.ml2]}>
                    <View
                      style={[
                        cStyles.mr2,
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

              <View style={cStyles.mt10}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel label={'project_management:description'} />
                  <CLabel customLabel={checkEmpty(chooseProject.descr)} />
                </View>
              </View>

              {chooseProject.lstUserInvited.length > 0 && (
                <View style={[cStyles.mt10]}>
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
                            index === chooseProject.lstUserInvited.length - 1 &&
                              cStyles.pb20,
                          ]}>
                          <CAvatar
                            containerStyle={cStyles.mr5}
                            label={item.fullName}
                            size={'vsmall'}
                          />
                          <View
                            style={[
                              cStyles.ml5,
                              cStyles.py6,
                              cStyles.flex1,
                              index !==
                                chooseProject.lstUserInvited.length - 1 &&
                                cStyles.borderBottom,
                              index !==
                                chooseProject.lstUserInvited.length - 1 &&
                                isDark &&
                                cStyles.borderBottomDark,
                            ]}>
                            <CLabel
                              medium
                              customLabel={checkEmpty(item.fullName)}
                            />
                            <CLabel customLabel={checkEmpty(item.email)} />
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
    height: 8,
    width: 8,
    borderRadius: 8,
  },
  list_invited: {height: 150},
});

export default ListProject;

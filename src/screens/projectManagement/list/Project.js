/**
 ** Name: List Project
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Projects.js
 **/
import React from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
/* COMPONENTS */
import ProjectItem from '../components/ProjectItem';
import CList from '~/components/CList';
/** COMMON */
import Routes from '~/navigation/Routes';
import {THEME_DARK} from '~/config/constants';

function ListProject(props) {
  const navigation = useNavigation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {showScrollTop} = props;

  /** HANDLE FUNC */
  const handleProjectItem = data => {
    navigation.navigate(Routes.MAIN.PROJECT_DETAIL.name, {
      data,
    });
  };

  /** RENDER */
  return (
    <CList
      data={props.data}
      item={({item, index}) => {
        let isPrevIsParent = false;
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
            onPress={handleProjectItem}
          />
        );
      }}
      showScrollTop={showScrollTop}
    />
  );
}

export default ListProject;

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

function ListProject(props) {
  const navigation = useNavigation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === 'dark';
  const {onLoadmore, onRefresh} = props;

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
        return (
          <ProjectItem
            index={index}
            data={item}
            customColors={customColors}
            darkMode={isDark}
            onRefresh={onRefresh}
            onPress={handleProjectItem}
          />
        );
      }}
      refreshing={props.refreshing}
      onRefresh={onRefresh}
      loadingmore={props.loadmore}
      onLoadmore={onLoadmore}
    />
  );
}

export default ListProject;

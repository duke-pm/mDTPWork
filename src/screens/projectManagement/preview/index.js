/**
 ** Name: ProjectPreview
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectPreview.js
 **/
import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
/** COMPONENTS */
import CText from '~/components/CText';
import CIconHeader from '~/components/CIconHeader';
import BodyPreview from '../components/BodyPreview';
/** COMMON */
import Icons from '~/config/Icons';
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {
  THEME_DARK,
  FIRST_CELL_WIDTH_LARGE,
  CELL_HEIGHT,
  CELL_WIDTH,
} from '~/config/constants';

const DATA = [
  {
    id: '1',
    name: 'What is Lorem Ipsum?',
    durations: '100 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [
      {
        id: '1.1',
        name: 'Why do we use it?',
        durations: '111 days',
        start: '01/01/2021',
        finish: '31/12/2021',
        predeceors: '',
        resoucesName: '',
        completed: 41,
        isChild: true,
        isProject: true,
        taskType: null,
        lstTask: [],
        lstProjChild: [],
      },
      {
        id: '1.2',
        name: 'Where can I get some?',
        durations: '122 days',
        start: '01/01/2021',
        finish: '31/12/2021',
        predeceors: '',
        resoucesName: '',
        completed: 37,
        isChild: true,
        isProject: true,
        taskType: null,
        lstTask: [
          {
            id: '1.2',
            name: 'The standard Lorem Ipsum passage, used since the 1500s',
            durations: '44 days',
            start: '01/01/2021',
            finish: '31/12/2021',
            predeceors: '',
            resoucesName: '',
            completed: 37,
            isChild: true,
            isProject: false,
            taskType: 'MILESTONE',
            lstTask: [],
            lstProjChild: [],
          },
        ],
        lstProjChild: [],
      },
    ],
  },
  {
    id: '2',
    name: '1914 translation by H. Rackham',
    durations: '99 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstProjChild: [],
    lstTask: [
      {
        id: '2.1',
        name:
          'Section 1.10.33 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC',
        durations: '12 days',
        start: '01/01/2021',
        finish: '31/12/2021',
        predeceors: '',
        resoucesName: '',
        completed: 37,
        isChild: true,
        isProject: false,
        taskType: 'PHASE',
        lstTask: [],
        lstProjChild: [],
      },
      {
        id: '2.1',
        name:
          'Contrary to popular belief, Lorem Ipsum is not simply random text',
        durations: '13 days',
        start: '01/01/2021',
        finish: '31/12/2021',
        predeceors: '',
        resoucesName: '',
        completed: 12,
        isChild: true,
        isProject: false,
        taskType: 'TASK',
        lstTask: [],
        lstProjChild: [],
      },
      {
        id: '2.1',
        name:
          'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia',
        durations: '14 days',
        start: '01/01/2021',
        finish: '31/12/2021',
        predeceors: '',
        resoucesName: '',
        completed: 23,
        isChild: true,
        isProject: false,
        taskType: 'MILESTONE',
        lstTask: [],
        lstProjChild: [],
      },
    ],
  },
  {
    id: '1.2',
    name: 'The standard Lorem Ipsum passage, used since the 1500s',
    durations: '88 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    durations: '77 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Odio eu feugiat pretium nibh ipsum consequat nisl vel',
    durations: '66 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Vel orci porta non pulvinar neque',
    durations: '55 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Nec dui nunc mattis enim ut tellus elementum sagittis',
    durations: '44 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Eget mauris pharetra et ultrices',
    durations: '33 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name:
      'Sollicitudin aliquam ultrices sagittis orci a scelerisque purus semper eget',
    durations: '22 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
  {
    id: '1.2',
    name: 'Vel pretium lectus quam id leo in vitae',
    durations: '11 days',
    start: '01/01/2021',
    finish: '31/12/2021',
    predeceors: '',
    resoucesName: '',
    completed: 37,
    isChild: false,
    isProject: true,
    taskType: null,
    lstTask: [],
    lstProjChild: [],
  },
];
const DATA_HEADER = [
  {
    width: CELL_WIDTH,
    name: 'Durations',
    key: 'durations',
  },
  {
    width: CELL_WIDTH,
    name: 'Start',
    key: 'start',
  },
  {
    width: CELL_WIDTH,
    name: 'Finish',
    key: 'finish',
  },
  {
    width: CELL_WIDTH,
    name: 'Predeceors',
    key: 'predeceors',
  },
  {
    width: CELL_WIDTH,
    name: 'Resource\nNames',
    key: 'resoucesName',
  },
  {
    width: CELL_WIDTH,
    name: '% Completed',
    key: 'completed',
  },
  {
    width: CELL_WIDTH,
    name: 'Custom 1',
    key: 'Custom 1',
  },
  {
    width: CELL_WIDTH,
    name: 'Custom 2',
    key: 'Custom 2',
  },
  {
    width: CELL_WIDTH,
    name: 'Custom 3',
    key: 'Custom 3',
  },
];

function ProjectPreview(props) {
  const isDark = useTheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {navigation} = props;

  /** All ref for page */
  let headerScrollView = useRef(null);

  /** All state for page */
  const [state, setState] = useState({
    loading: true,
    dataRender: [],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleExportExcel = () => {};

  const handleShowFilter = () => {};

  /**********
   ** FUNC **
   **********/
  const formatRowForSheet = section => {
    return section.item.render;
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    /** Force to Horizontal to see many fields */
    Orientation.lockToLandscapeLeft();

    /** Prepare data body */
    let tmpDataRender = [
      {
        key: 'body',
        render: (
          <BodyPreview
            dataHeader={DATA_HEADER}
            dataBody={DATA}
            headerScroll={headerScrollView}
          />
        ),
      },
    ];
    setState({loading: false, dataRender: tmpDataRender});

    /** After done and quit this page => Force to Vertical */
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: false,
              icon: Icons.exportExcel,
              onPress: handleExportExcel,
            },
            {
              show: true,
              showRedDot: false,
              icon: Icons.filter,
              onPress: handleShowFilter,
            },
          ]}
        />
      ),
    });
  }, [navigation]);

  /************
   ** RENDER **
   ************/
  const formatCell = (align = 'center', value = '') => {
    return (
      <View
        key={value}
        style={[
          cStyles.center,
          cStyles[align],
          cStyles.px6,
          cStyles.borderLeft,
          cStyles.borderBottom,
          isDark && cStyles.borderLeftDark,
          isDark && cStyles.borderBottomDark,
          styles.cell,
          {
            backgroundColor: IS_ANDROID
              ? customColors.green
              : customColors.indigo,
          },
        ]}>
        <CText
          customStyles={[
            cStyles.textCenter,
            cStyles.textCaption1,
            cStyles.fontBold,
            {color: colors.WHITE},
          ]}
          numberOfLines={1}
          customLabel={value}
        />
      </View>
    );
  };

  const formatHeader = () => {
    let cols = [],
      item;
    for (item of DATA_HEADER) {
      cols.push(formatCell('center', item.name));
    }
    return (
      <View style={cStyles.row}>
        <View
          style={[
            cStyles.abs,
            cStyles.center,
            cStyles.borderLeft,
            cStyles.borderBottom,
            isDark && cStyles.borderLeftDark,
            isDark && cStyles.borderBottomDark,
            styles.first_cell,
            {
              backgroundColor: IS_ANDROID
                ? customColors.green
                : customColors.indigo,
            },
          ]}>
          <CText
            customStyles={[
              cStyles.textCenter,
              cStyles.textCaption1,
              cStyles.fontBold,
              {color: colors.WHITE},
            ]}
            numberOfLines={1}
            label={'project_preview:task_name'}
          />
        </View>
        <ScrollView
          ref={ref => (headerScrollView = ref)}
          contentContainerStyle={styles.row_header}
          horizontal
          scrollEnabled={false}
          scrollEventThrottle={16}
          removeClippedSubviews={IS_ANDROID}
          showsHorizontalScrollIndicator={false}>
          {cols}
        </ScrollView>
      </View>
    );
  };
  return (
    <SafeAreaView style={cStyles.flex1} edges={['left', 'bottom']}>
      <View style={cStyles.flex1}>
        {formatHeader()}
        {!state.loading && (
          <>
            <FlatList
              style={cStyles.shadowListItem}
              data={state.dataRender}
              renderItem={formatRowForSheet}
              keyExtractor={(item, index) => item.key + index.toString()}
              scrollEventThrottle={16}
              removeClippedSubviews={IS_ANDROID}
            />
          </>
        )}
        {state.loading && <ActivityIndicator />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row_header: {paddingLeft: FIRST_CELL_WIDTH_LARGE},
  cell: {width: CELL_WIDTH, height: CELL_HEIGHT},
  first_cell: {width: FIRST_CELL_WIDTH_LARGE, height: CELL_HEIGHT},
});

export default ProjectPreview;

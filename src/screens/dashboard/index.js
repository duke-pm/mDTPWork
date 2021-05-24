/**
 ** Name: Dashboard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React from 'react';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import Item from './components/Item';
/** COMMON */
import Common from './common';
import {cStyles} from '~/utils/style';

function Dashboard(props) {
  /** HANDLE FUNC */
  const handleItem = data => {
    props.navigation.navigate(data);
  };

  /** RENDER */
  return (
    <CContainer
      loading={false}
      header
      title={'dashboard:title'}
      content={
        <CContent>
          <CList
            contentStyle={cStyles.pt16}
            data={Common.Data}
            item={({item, index}) => {
              return <Item index={index} data={item} onPress={handleItem} />;
            }}
            numColumns={3}
          />
        </CContent>
      }
    />
  );
}

export default Dashboard;

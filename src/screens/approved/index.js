/**
 ** Name: Approved
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React from 'react';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CList from '~/components/CList';
import Item from './components/Item';
/** COMMON */
import DataRoute from './common/Assets';
import {cStyles} from '~/utils/style';

function Approved(props) {
  /** HANDLE FUNC */
  const handleItem = data => {
    props.navigation.navigate(data);
  };

  /** RENDER */
  return (
    <CContainer
      title={'approved:assets'}
      loading={false}
      header
      hasBack
      content={
        <CContent>
          <CList
            contentStyle={cStyles.pt16}
            data={DataRoute}
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

export default Approved;

/**
 ** Name: Approved page
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fromJS } from 'immutable';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
/* COMMON */
import Routes from '~/navigation/Routes';
import ListRequest from './list/Request';
/* REDUX */
import * as Actions from '~/redux/actions';

function Approved(props) {
  const dispatch = useDispatch();
  const commonState = useSelector(({ common }) => common);
  const approvedState = useSelector(({ approved }) => approved);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({
    requests: [],
    page: 1,
    perPage: commonState.get('perPage'),
  });

  /** HANDLE FUNC */
  const handleAddNew = () => {
    props.navigation.navigate(Routes.MAIN.ADD_APPROVED.name);
  };

  /** FUNC */
  const onFetchData = () => {
    let params = fromJS({
      'FromDate': '2021/04/01',
      'ToDate': '2021/04/30',
      'StatusID': 0,
      'PageSize': data.perPage,
      'PageNum': data.page,
      'Search': '',
    });
    dispatch(Actions.fetchListRequestApproved(params));
  };

  const onPrepareData = (status) => {
    setData({
      ...data,
      requests: status ? approvedState.get('requests') : [],
    });
    setError(!status);
    setLoading(false);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onFetchData();
  }, []);

  useEffect(() => {
    if (loading) {
      if (!approvedState.get('submitting')) {
        if (approvedState.get('successListRequest')) {
          return onPrepareData(true);
        }

        if (approvedState.get('errorListRequest')) {
          return onPrepareData(false);
        }
      }
    }
  }, [
    loading,
    approvedState.get('submitting'),
    approvedState.get('successListRequest'),
    approvedState.get('errorListRequest')
  ]);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      header
      hasAddNew
      hasBack
      title={'approved:title'}
      onPressAddNew={handleAddNew}
      content={
        <CContent padder>
          {!loading &&
            <ListRequest
              data={data.requests}
            />
          }
        </CContent>
      }
    />
  );
};

export default Approved;

/**
 ** Name: 
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of .js
 **/

const Mockup = [
  {
    id: 'approved',
    name: 'Approved',
    image: '',
    mockup: {
      me: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          department: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          dateRequest: '2021-04-20',
          area: {
            id: 'hcm',
            name: 'Hồ Chí Minh',
          },
          assets: [
            {
              description: 'Máy bàn (desktop).',
              amount: 1,
              price: '',
              total: '',
            },
          ],
          whereUse: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          reason: '',
          typeAsset: {
            id: 'new',
            name: 'Mua mới',
          },
          inPlanning: true,
          supplier: '',
          status: 'request',
        },
        {
          id: 2,
          name: 'Nguyễn Văn A',
          department: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          dateRequest: '2021-04-21',
          area: {
            id: 'hcm',
            name: 'Hồ Chí Minh',
          },
          assets: [
            {
              description: 'Laptop.',
              amount: 1,
              price: '',
              total: '',
            },
          ],
          whereUse: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          reason: '',
          typeAsset: {
            id: 'additional',
            name: 'Bổ sung',
          },
          inPlanning: false,
          supplier: '',
          status: 'submit',
        },
        {
          id: 3,
          name: 'Nguyễn Văn A',
          department: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          dateRequest: '2021-04-22',
          area: {
            id: 'hcm',
            name: 'Hồ Chí Minh',
          },
          assets: [
            {
              description: 'Văn phòng phẩm.',
              amount: 1,
              price: '',
              total: '',
            },
          ],
          whereUse: {
            id: 'it',
            name: 'Bộ phận IT',
          },
          reason: '',
          typeAsset: {
            id: 'new',
            name: 'Bổ sung',
          },
          inPlanning: true,
          supplier: '',
          status: 'approved',
        },
      ]
    }
  },
];

export default Mockup;

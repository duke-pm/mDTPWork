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
    title: 'approved:assets',
    icon: require('../../../../../assets/images/icon/assets.png'),
    status: true,
    childrens: [
      {
        id: 'approvedAssets',
        name: 'RequestAssets',
        title: 'approved:assets',
        icon: require('../../../../../assets/images/icon/assets.png'),
        status: true,
        childrens: [
          {
            id: 'listRequestAssets',
            name: 'ListRequestAssets',
            title: 'approved:assets',
            status: true,
          },
          {
            id: 'addRequestAssets',
            name: 'AddRequestAssets',
            title: 'approved:assets',
            status: true,
          },
        ],
      },
      {
        id: 'approvedLostDamage',
        name: 'RequestLostDamage',
        title: 'approved:assets',
        icon: require('../../../../../assets/images/icon/assets.png'),
        status: true,
        childrens: [
          {
            id: 'listRequestLostDamage',
            name: 'ListRequestLostDamage',
            title: 'approved:assets',
            status: true,
          },
          {
            id: 'addRequestLostDamage',
            name: 'AddRequestLostDamage',
            title: 'approved:assets',
            status: true,
          },
        ],
      }
    ]
  },
];

export default Mockup;

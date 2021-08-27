/**
 ** Name: Mockup Booking
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Booking.js
 **/

const Resources = [
  {
    id: 1,
    label: 'Phòng họp HCM',
    cretaedUser: 'Lorem Ipsum',
    updatedDate: '2021-07-25 00:00:00',
    status: true,
  },
  {
    id: 2,
    label: 'Phòng họp HN',
    cretaedUser: 'Neque porro',
    updatedDate: '2021-07-25 00:00:00',
    status: true,
  },
];

const Bookings = [
  {
    id: 1,
    label: 'The standard Lorem Ipsum passage',
    fromDate: '2021-08-26 08:00:00',
    toDate: '2021-08-26 17:00:00',
    note:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    resource: {
      id: 1,
      label: 'Phòng họp HCM',
      cretaedUser: 'Lorem Ipsum',
      updatedDate: '2021-07-25 00:00:00',
      status: true,
    },
    status: 'Active',
    cretaedUser: 'Lorem Ipsum',
    cretaedDate: '2021-07-30 08:00:00',
    color: '#e6add8',
    users: [
      'Alex Hunter',
      'Bill Arnold',
      'Jessica Barrera',
      'Alice Freeman',
      'Jonny Katina',
    ],
  },
  {
    id: 2,
    label: 'Contrary to popular belief',
    fromDate: '2021-08-27 08:00:00',
    toDate: '2021-08-27 12:00:00',
    note:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    resource: {
      id: 2,
      label: 'Phòng họp HN',
      cretaedUser: 'Neque porro',
      updatedDate: '2021-07-25 00:00:00',
      status: true,
    },
    status: 'Active',
    cretaedUser: 'Malorum',
    cretaedDate: '2021-08-03 13:00:00',
    color: '#ade6d8',
    users: ['Alex Hunter', 'Alice Freeman', 'Jonny Katina'],
  },
  {
    id: 3,
    label: 'Sections 1.10.32 and 1.10.33',
    fromDate: '2021-08-27 13:00:00',
    toDate: '2021-08-27 17:00:00',
    note:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    resource: {
      id: 1,
      label: 'Phòng họp HCM',
      cretaedUser: 'Lorem Ipsum',
      updatedDate: '2021-07-25 00:00:00',
      status: true,
    },
    status: 'Active',
    cretaedUser: 'H. Rackham',
    cretaedDate: '2021-08-12 08:00:00',
    color: '#e6bcad',
    users: ['Bill Arnold', 'Alice Freeman'],
  },
];

export default {Bookings, Resources};

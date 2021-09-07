/**
 ** Name: Constants of app
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Constants.js
 **/
import {moderateScale} from '~/utils/helper';

export const LOAD_MORE = 'LOAD_MORE';
export const REFRESH = 'REFRESH';
export const LOGIN = 'LOGIN';
export const LANGUAGE = 'LANGUAGE';
export const LAST_COMMENT_TASK = 'LAST_COMMENT_TASK';
export const BIOMETRICS = 'BIOMETRICS';
export const FAST_LOGIN = 'FAST_LOGIN';
export const DTP_CALENDAR = 'DTP_CALENDAR';
export const DARK_MODE = 'DARK_MODE';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const DEFAULT_LANGUAGE_CODE = 'vi';
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_FORMAT_DATE_1 = 'YYYY-MM-DD';
export const DEFAULT_FORMAT_DATE_2 = 'DD/MM/YYYY';
export const DEFAULT_FORMAT_DATE_3 = 'YYYY/MM/DD';
export const DEFAULT_FORMAT_DATE_4 = 'YYYY-MM-DDTHH:mm:ss';
export const DEFAULT_FORMAT_DATE_5 = 'DD MMMM YYYY';
export const DEFAULT_FORMAT_DATE_6 = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_HEIGHT_UPLOAD = 250;
export const DEFAULT_WIDTH_UPLOAD = 250;
export const FIRST_CELL_WIDTH_LARGE = moderateScale(300);
export const FIRST_CELL_WIDTH_SMALL = moderateScale(150);
export const FIRST_CELL_WIDTH_DISTANCE =
  FIRST_CELL_WIDTH_LARGE - FIRST_CELL_WIDTH_SMALL;
export const CELL_HEIGHT = moderateScale(45);
export const CELL_WIDTH = moderateScale(150);
export const DATA_TIME_BOOKING = [
  '00:00',
  '00:30',
  '01:00',
  '01:30',
  '02:00',
  '02:30',
  '03:00',
  '03:30',
  '04:00',
  '04:30',
  '05:00',
  '05:30',
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
  '22:30',
  '23:00',
  '23:30',
];
export const DATA_CONTACT_US = [
  {
    id: '1',
    label: 'CÔNG TY TNHH EDUCATION SOLUTIONS VIỆT NAM',
    address:
      '148 - 150 Nguyễn Đình Chính, P. 8, Quận Phú Nhuận, Tp. Hồ Chí Minh',
    phone: ['(+84) 28 3845 6936', '(+84) 3845 6937', '(+84) 28 3845 6928'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '2',
    label: 'CHI NHÁNH MIỀN BẮC',
    address:
      'Tầng 7, Số 227, Đường Nguyễn Ngọc Nại, P. Khương Mai, Q. Thanh Xuân, Tp. Hà Nội',
    phone: ['(+84) 24 3513 4278', '(+84) 24 3513 4279'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '3',
    label: 'VĂN PHÒNG ĐẠI DIỆN MIỀN TRUNG',
    address: '90/2 Nguyễn Văn Linh, Q. Hải Châu, Tp. Đà Nẵng',
    phone: ['(+84) 236 3849 076', '(+84) 236 3692 775', '(+84) 236 3849 076'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '4',
    label: 'VĂN PHÒNG ĐẠI DIỆN ĐÔNG NAM BỘ',
    address: 'D08, 253 Phạm Văn Thuận, P. Tân Mai, Tp. Biên Hòa, Đồng Nai',
    phone: ['(+84) 251 3918 711', '(+84) 251 3918 713'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '5',
    label: 'VĂN PHÒNG ĐẠI DIỆN MEKONG',
    address:
      'Tầng 5, Toà nhà STS, 11B Đại lộ Hoà Bình, Q. Ninh Kiều, Tp. Cần Thơ',
    phone: ['(+84) 292 6252 559', '(+84) 292 6252 558'],
    email: 'info@dtp-education.com',
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '6',
    label: 'CHI NHÁNH LAOS',
    address:
      'House No. 108, Unit 07, Ban Phone Sinuane, Phone Sinuane Road., Sisattanak District, Vientiane Capital, Laos',
    phone: ['(+856) 20 5554 2926'],
    email: 'info.dtplaos@dtp-education.com',
    website: 'https://www.tes-thailand.com/',
  },
  {
    id: '7',
    label: 'CHI NHÁNH THÁI LAN',
    address:
      'H.Cape Bizplus Wongwaen-Onnut 24/25 Sukhapiban 2 RD.Prawet Bangkok 10250',
    phone: ['(+66) 21 154 943'],
    email: null,
    website: 'https://www.dtp-education.com/',
  },
  {
    id: '8',
    label: 'CHI NHÁNH CAMBODIA',
    address: '(3rd Floor), St. 63, Chak Tomuk Daun Penh, Phnom Penh',
    phone: ['(+855) 16 555 287'],
    email: null,
    website: 'https://www.dtpcambodia.com/',
  },
  {
    id: '9',
    label: 'CHI NHÁNH SINGAPORE',
    address: '470 North Bridge Road # 05-12 Bugis Cube Singapore (188735)',
    phone: [],
    email: null,
    website: 'https://www.edpub.sg/',
  },
];

/**
 ** Name: Constants of app
 ** Author: Jerry
 ** CreateAt: 2021
 ** Description: Description of Constants.js
 **/
import {moderateScale} from "~/utils/helper";

export const LOAD_MORE = "LOAD_MORE";
export const REFRESH = "REFRESH";
export const LIGHT = "light";
export const DARK = "dark";
export const DEFAULT_LANGUAGE_CODE = "vi";
export const DEFAULT_THEME = "light";
export const DEFAULT_PER_PAGE = 10;
export const DEFAULT_FORMAT_DATE_1 = "YYYY-MM-DD";
export const DEFAULT_FORMAT_DATE_2 = "DD/MM/YYYY";
export const DEFAULT_FORMAT_DATE_3 = "YYYY/MM/DD";
export const DEFAULT_FORMAT_DATE_4 = "YYYY-MM-DDTHH:mm:ss";
export const DEFAULT_FORMAT_DATE_5 = "DD MMMM YYYY";
export const DEFAULT_FORMAT_DATE_6 = "YYYY-MM-DD HH:mm:ss";
export const DEFAULT_FORMAT_DATE_7 = "DD/MM/YYYY - HH:mm";
export const DEFAULT_FORMAT_DATE_8 = "dddd - DD/MM/YYYY";
export const DEFAULT_FORMAT_DATE_9 = "DD MMM YY";
export const DEFAULT_FORMAT_DATE_10 = "dddd - DD MMMM YYYY";
export const DEFAULT_FORMAT_TIME_1 = "HH:mm";
export const DEFAULT_FORMAT_TIME_2 = "hh:mm";
export const DEFAULT_FORMAT_TIME_3 = "HH:mm:ss";
export const DEFAULT_HEIGHT_UPLOAD = 250;
export const DEFAULT_WIDTH_UPLOAD = 250;
export const FIRST_CELL_WIDTH_LARGE = moderateScale(300);
export const FIRST_CELL_WIDTH_SMALL = moderateScale(120);
export const FIRST_CELL_WIDTH_DISTANCE =
  FIRST_CELL_WIDTH_LARGE - FIRST_CELL_WIDTH_SMALL;
export const CELL_HEIGHT = moderateScale(45);
export const CELL_WIDTH = moderateScale(150);
export const DATA_YEAR_FILTER = [
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
];
export const DATA_TIME_BOOKING = [
  {value: "00:00", label: "00:00"},
  {value: "00:30", label: "00:30"},
  {value: "01:00", label: "01:00"},
  {value: "01:30", label: "01:30"},
  {value: "02:00", label: "02:00"},
  {value: "02:30", label: "02:30"},
  {value: "03:00", label: "03:00"},
  {value: "03:30", label: "03:30"},
  {value: "04:00", label: "04:00"},
  {value: "04:30", label: "04:30"},
  {value: "05:00", label: "05:00"},
  {value: "05:30", label: "05:30"},
  {value: "06:00", label: "06:00"},
  {value: "06:30", label: "06:30"},
  {value: "07:00", label: "07:00"},
  {value: "07:30", label: "07:30"},
  {value: "08:00", label: "08:00"},
  {value: "08:30", label: "08:30"},
  {value: "09:00", label: "09:00"},
  {value: "09:30", label: "09:30"},
  {value: "10:00", label: "10:00"},
  {value: "10:30", label: "10:30"},
  {value: "11:00", label: "11:00"},
  {value: "11:30", label: "11:30"},
  {value: "12:00", label: "12:00"},
  {value: "12:30", label: "12:30"},
  {value: "13:00", label: "13:00"},
  {value: "13:30", label: "13:30"},
  {value: "14:00", label: "14:00"},
  {value: "14:30", label: "14:30"},
  {value: "15:00", label: "15:00"},
  {value: "15:30", label: "15:30"},
  {value: "16:00", label: "16:00"},
  {value: "16:30", label: "16:30"},
  {value: "17:00", label: "17:00"},
  {value: "17:30", label: "17:30"},
  {value: "18:00", label: "18:00"},
  {value: "18:30", label: "18:30"},
  {value: "19:00", label: "19:00"},
  {value: "19:30", label: "19:30"},
  {value: "20:00", label: "20:00"},
  {value: "20:30", label: "20:30"},
  {value: "21:00", label: "21:00"},
  {value: "21:30", label: "21:30"},
  {value: "22:00", label: "22:00"},
  {value: "22:30", label: "22:30"},
  {value: "23:00", label: "23:00"},
  {value: "23:30", label: "23:30"},
];
export const DATA_CONTACT_US = [
  {
    id: "1",
    label: "CÔNG TY TNHH EDUCATION SOLUTIONS VIỆT NAM",
    address:
      "148 - 150 Nguyễn Đình Chính, P. 8, Quận Phú Nhuận, Tp. Hồ Chí Minh",
    phone: ["(+84) 28 3845 6936", "(+84) 3845 6937", "(+84) 28 3845 6928"],
    email: "info@dtp-education.com",
    website: "https://www.dtp-education.com/",
  },
  {
    id: "2",
    label: "CHI NHÁNH MIỀN BẮC",
    address:
      "Tầng 7, Số 227, Đường Nguyễn Ngọc Nại, P. Khương Mai, Q. Thanh Xuân, Tp. Hà Nội",
    phone: ["(+84) 24 3513 4278", "(+84) 24 3513 4279"],
    email: "info@dtp-education.com",
    website: "https://www.dtp-education.com/",
  },
  {
    id: "3",
    label: "VĂN PHÒNG ĐẠI DIỆN MIỀN TRUNG",
    address: "90/2 Nguyễn Văn Linh, Q. Hải Châu, Tp. Đà Nẵng",
    phone: ["(+84) 236 3849 076", "(+84) 236 3692 775", "(+84) 236 3849 076"],
    email: "info@dtp-education.com",
    website: "https://www.dtp-education.com/",
  },
  {
    id: "4",
    label: "VĂN PHÒNG ĐẠI DIỆN ĐÔNG NAM BỘ",
    address: "D08, 253 Phạm Văn Thuận, P. Tân Mai, Tp. Biên Hòa, Đồng Nai",
    phone: ["(+84) 251 3918 711", "(+84) 251 3918 713"],
    email: "info@dtp-education.com",
    website: "https://www.dtp-education.com/",
  },
  {
    id: "5",
    label: "VĂN PHÒNG ĐẠI DIỆN MEKONG",
    address:
      "Tầng 5, Toà nhà STS, 11B Đại lộ Hoà Bình, Q. Ninh Kiều, Tp. Cần Thơ",
    phone: ["(+84) 292 6252 559", "(+84) 292 6252 558"],
    email: "info@dtp-education.com",
    website: "https://www.dtp-education.com/",
  },
  {
    id: "6",
    label: "CHI NHÁNH LAOS",
    address:
      "House No. 108, Unit 07, Ban Phone Sinuane, Phone Sinuane Road., Sisattanak District, Vientiane Capital, Laos",
    phone: ["(+856) 20 5554 2926"],
    email: "info.dtplaos@dtp-education.com",
    website: "https://www.tes-thailand.com/",
  },
  {
    id: "7",
    label: "CHI NHÁNH THÁI LAN",
    address:
      "H.Cape Bizplus Wongwaen-Onnut 24/25 Sukhapiban 2 RD.Prawet Bangkok 10250",
    phone: ["(+66) 21 154 943"],
    email: null,
    website: "https://www.dtp-education.com/",
  },
  {
    id: "8",
    label: "CHI NHÁNH CAMBODIA",
    address: "(3rd Floor), St. 63, Chak Tomuk Daun Penh, Phnom Penh",
    phone: ["(+855) 16 555 287"],
    email: null,
    website: "https://www.dtpcambodia.com/",
  },
  {
    id: "9",
    label: "CHI NHÁNH SINGAPORE",
    address: "470 North Bridge Road # 05-12 Bugis Cube Singapore (188735)",
    phone: [],
    email: null,
    website: "https://www.edpub.sg/",
  },
];

/** Keys of Async Storage */
export const AST_DARK_MODE = "AST_DARK_MODE";
export const AST_LANGUAGE = "AST_LANGUAGE";
export const AST_LOGIN = "AST_LOGIN";
export const AST_SETTINGS = "AST_SETTINGS";
export const AST_LAST_COMMENT_TASK = "AST_LAST_COMMENT_TASK";

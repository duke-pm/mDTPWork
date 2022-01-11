/**
 ** Name: theme context
 ** Author: JerryLe
 ** CreateAt: 2021
 ** Description: Description of theme-context.js
 **/
import React from "react";

export const ThemeContext = React.createContext({
  themeApp: "light",
  toggleTheme: () => {},
});

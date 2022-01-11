/**
 ** Name: Group Type Show
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of GroupTypeShow.js
 **/
import PropTypes from "prop-types";
import React from "react";
import {Button, Icon, Layout} from "@ui-kitten/components";
/* COMMON */
import {Commons} from "~/utils/common";
import {cStyles} from "~/utils/style";

const RenderListIcon = props => (
  <Icon {...props} name="list-outline" />
);

const RenderCalendarIcon = props => (
  <Icon {...props} name="calendar-outline" />
);

function GroupTypeShow(props) {
  const {
    type = Commons.TYPE_SHOW_BOOKING.CALENDAR.value,
    onChange = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <Layout
      style={[
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.justifyEnd,
        cStyles.py6,
        cStyles.px10,
      ]}>
      <Button
        style={cStyles.mr10}
        size="tiny"
        appearance={type === Commons.TYPE_SHOW_BOOKING.LIST.value
          ? "filled"
          : "outline"
        }
        status={type === Commons.TYPE_SHOW_BOOKING.LIST.value
          ? "primary"
          : "basic"}
        accessoryLeft={RenderListIcon}
        onPress={() => onChange(Commons.TYPE_SHOW_BOOKING.LIST.value)}
      />
      <Button
        size="tiny"
        appearance={type === Commons.TYPE_SHOW_BOOKING.CALENDAR.value
          ? "filled"
          : "outline"
        }
        status={type === Commons.TYPE_SHOW_BOOKING.CALENDAR.value
          ? "primary"
          : "basic"}
        accessoryLeft={RenderCalendarIcon}
        onPress={() => onChange(Commons.TYPE_SHOW_BOOKING.CALENDAR.value)}
      />
    </Layout>
  );
}

GroupTypeShow.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default GroupTypeShow;

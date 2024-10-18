import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SearchIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 18 20"
    fill="currentColor"
    {...props}
  >
    <Path
      d="M12.6953 13.5318L15.3002 16.2M8.5502 5.71765C10.0414 5.71765 11.2502 6.99759 11.2502 8.57647M14.4602 9.08471C14.4602 12.5232 11.8276 15.3106 8.5802 15.3106C5.33276 15.3106 2.7002 12.5232 2.7002 9.08471C2.7002 5.64625 5.33276 2.85883 8.5802 2.85883C11.8276 2.85883 14.4602 5.64625 14.4602 9.08471Z"
      stroke="black"
      strokeOpacity={0.7}
      strokeLinecap="round"
    />
  </Svg>
);
export default SearchIcon;

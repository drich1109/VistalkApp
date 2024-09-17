import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const BackIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <Path
      d="M13.5 7H0.5"
      stroke="#000001"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 3.5L0.5 7L4 10.5"
      stroke="#000001"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default BackIcon;
